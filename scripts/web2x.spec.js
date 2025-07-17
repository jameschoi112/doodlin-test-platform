const { test, expect } = require('@playwright/test');

test('WEB2X 이용가이드 팝업 닫기', async ({ page }, testInfo) => {
  const errors = [];
  let stepIndex = 0;

  await test.step('Go to target URL', async () => {
    try {
      const targetUrl = process.env.TARGET_URL || 'https://web2x.io/';
      await page.goto(targetUrl, { timeout: 15000 });
      await expect(page).toHaveTitle(/WEB2X/, { timeout: 5000 });
    } catch (error) {
      errors.push(error);
      const screenshotBase64 = (await page.screenshot()).toString('base64');
      const report = { type: 'screenshot:add', payload: { failedStepIndex: stepIndex, screenshotBase64 } };
      process.stdout.write(JSON.stringify(report) + '__END_OF_JSON__');
    }
    stepIndex++;
  });

  await test.step('Click "Do not show again" checkbox', async () => {
    try {
      // 5초 내에 요소를 찾지 못하면 타임아웃 에러 발생
      await page.locator('span.ant-typography.embla__isShowChec-wrong').click({ timeout: 5000 });
    } catch (error) {
      errors.push(error);
      const screenshotBase64 = (await page.screenshot()).toString('base64');
      const report = { type: 'screenshot:add', payload: { failedStepIndex: stepIndex, screenshotBase64 } };
      process.stdout.write(JSON.stringify(report) + '__END_OF_JSON__');
    }
    stepIndex++;
  });

  await test.step('Verify modal is closed', async () => {
    try {
      await expect(page.locator('div.ant-modal-conten')).not.toBeVisible({ timeout: 5000 });
    } catch (error) {
      errors.push(error);
      const screenshotBase64 = (await page.screenshot()).toString('base64');
      const report = { type: 'screenshot:add', payload: { failedStepIndex: stepIndex, screenshotBase64 } };
      process.stdout.write(JSON.stringify(report) + '__END_OF_JSON__');
    }
    stepIndex++;
  });

  // 모든 스텝이 끝난 후, 기록된 에러가 있으면 테스트를 실패 처리
  if (errors.length > 0) {
    throw new Error(`Test failed with ${errors.length} error(s). First error: ${errors[0].message}`);
  }
});
