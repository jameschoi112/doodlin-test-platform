const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs/promises');
const admin = require('firebase-admin');

// .env 파일에 GOOGLE_APPLICATION_CREDENTIALS 설정 필요
// 예: GOOGLE_APPLICATION_CREDENTIALS="./dodlin-test-platform-firebase-adminsdk-b1hmy-9809e8165f.json"
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://10.150.10.160:3000"],
    methods: ["GET", "POST"]
  }
});

const port = 3001;

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

// 스크립트 파일 목록을 가져오는 API
app.get('/api/scripts', async (req, res) => {
  const scriptsDir = path.join(__dirname, 'scripts');
  try {
    const files = await fs.readdir(scriptsDir);
    const scriptFiles = files.filter(file => file.endsWith('.js') || file.endsWith('.spec.js'));
    res.json(scriptFiles);
  } catch (error) {
    console.error('Error reading scripts directory:', error);
    res.status(500).json({ message: '스크립트 폴더를 읽는 중 오류 발생' });
  }
});

app.post('/api/run-test/:testId', async (req, res) => {
  const { testId } = req.params;
  const startTime = Date.now();
  console.log(`Received request to run test: ${testId}`);

  try {
    const testCaseRef = db.collection('testCases').doc(testId);
    const testCaseSnap = await testCaseRef.get();

    if (!testCaseSnap.exists) {
      return res.status(404).json({ message: 'Test case not found' });
    }
    const testCaseData = testCaseSnap.data();
    const { scriptPath } = testCaseData;

    if (!scriptPath) {
      await testCaseRef.update({ status: 'Failed', lastResult: '실행할 스크립트 파일이 지정되지 않았습니다.' });
      return res.status(400).json({ message: '실행할 스크립트 파일이 지정되지 않았습니다.' });
    }

    const originalStepNames = testCaseData.templateSteps || (Array.isArray(testCaseData.steps) ? testCaseData.steps.map(s => s.name) : []);
    const initialSteps = originalStepNames.map(name => ({ name, status: 'Pending', duration: 0, error: null }));
    await testCaseRef.update({ status: 'In Progress', steps: initialSteps, lastRun: admin.firestore.FieldValue.serverTimestamp() });
    
    res.status(202).json({ message: 'Test execution started' });
    io.emit('test:start', { testId });

    const fullScriptPath = path.join(__dirname, 'scripts', scriptPath);
    const testProcess = spawn('npx', ['playwright', 'test', fullScriptPath, '--headed'], {
      env: {
        ...process.env,
        TARGET_URL: testCaseData.testUrl,
      },
    });

    let accumulatedData = '';
    let errorOutput = '';
    let stepIndex = 0;

    testProcess.stdout.on('data', (data) => {
      accumulatedData += data.toString();
      const reports = accumulatedData.split('__END_OF_JSON__');
      accumulatedData = reports.pop() || '';

      reports.forEach(async (reportStr) => {
        if (!reportStr) return;
        try {
          console.log(`[Server] Received raw string: "${reportStr}"`);
          const report = JSON.parse(reportStr);
          console.log(`[Server] Parsed report type: ${report.type}`);
          io.emit('test:event', { testId, ...report });

          const testCaseRef = db.collection('testCases').doc(testId);

          if (report.type === 'step:end') {
            const doc = await testCaseRef.get();
            if (!doc.exists) return;
            const steps = doc.data().steps;
            if (stepIndex < steps.length) {
              steps[stepIndex].status = report.payload.status;
              steps[stepIndex].duration = report.payload.duration;
              steps[stepIndex].error = report.payload.error || null;
              await testCaseRef.update({ steps });
              stepIndex++;
            }
          } else if (report.type === 'screenshot:add') {
            console.log('[Server] Processing screenshot:add event...');
            const { failedStepIndex, screenshotBase64 } = report.payload;
            const screenshotBuffer = Buffer.from(screenshotBase64, 'base64');
            const destination = `screenshots/${testId}-${Date.now()}.png`;
            const file = bucket.file(destination);
            
            await file.save(screenshotBuffer, { metadata: { contentType: 'image/png' } });
            console.log(`[Server] Screenshot saved to bucket at: ${destination}`);

            const [signedUrl] = await file.getSignedUrl({ action: 'read', expires: Date.now() + 100 * 365 * 24 * 60 * 60 * 1000 });
            console.log(`[Server] Generated signed URL.`);

            const doc = await testCaseRef.get();
            if (!doc.exists) return;
            const steps = doc.data().steps;
            if (steps && steps[failedStepIndex]) {
              steps[failedStepIndex].screenshotURL = signedUrl;
              await testCaseRef.update({ steps });
              console.log(`[Server] Firestore updated with screenshot URL for step index: "${failedStepIndex}"`);
            } else {
              console.error(`[Server] ERROR: Could not find step at index "${failedStepIndex}" in Firestore to update URL.`);
            }
          } else if (report.type === 'test:end') {
            await testCaseRef.update({
              status: report.payload.status === 'passed' ? 'Completed' : 'Failed',
              duration: report.payload.duration
            });
            io.emit('test:finish', { testId, status: report.payload.status });
          }
        } catch (e) {
          console.error('[Server] ERROR processing report:', e);
        }
      });
    });

    testProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    testProcess.on('close', async (code) => {
      if (code !== 0 && errorOutput) {
        console.error(`Playwright process exited with code ${code} and error: ${errorOutput}`);
        const testCaseRef = db.collection('testCases').doc(testId);
        await testCaseRef.update({ status: 'Failed', lastResult: errorOutput });
        io.emit('test:finish', { testId, status: 'Failed' });
      }
    });

  } catch (e) {
    console.error('Error in run-test process:', e.message);
    const testCaseRef = db.collection('testCases').doc(testId);
    if (testCaseRef) {
      await testCaseRef.update({ status: 'Failed', lastResult: e.message });
    }
  }
});

httpServer.listen(port, '0.0.0.0', () => {
  console.log(`API server with WebSocket listening at http://0.0.0.0:${port}`);
});