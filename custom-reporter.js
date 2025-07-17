// 재귀적으로 실패한 첫 번째 스텝을 찾는 헬퍼 함수
function findFirstFailedStep(steps, index = { value: 0 }) {
  for (const step of steps) {
    if (step.category === 'test.step') {
      if (step.error) {
        return { step, index: index.value };
      }
      index.value++;
    }
    if (step.steps) {
      const result = findFirstFailedStep(step.steps, index);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

class CustomReporter {
  onTestBegin(test) {
    const report = {
      type: 'test:start',
      payload: {
        title: test.title,
      },
    };
    process.stdout.write(JSON.stringify(report) + '__END_OF_JSON__');
  }

  onStepEnd(test, result, step) {
    if (step.category === 'test.step') {
      const report = {
        type: 'step:end',
        payload: {
          title: step.title,
          duration: step.duration,
          status: step.error ? 'failed' : 'passed',
          error: step.error?.message,
        },
      };
      process.stdout.write(JSON.stringify(report) + '__END_OF_JSON__');
    }
  }

  onTestEnd(test, result) {
    const testEndReport = {
      type: 'test:end',
      payload: {
        duration: result.duration,
        status: result.status,
      },
    };
    process.stdout.write(JSON.stringify(testEndReport) + '__END_OF_JSON__');
  }
}

module.exports = CustomReporter;