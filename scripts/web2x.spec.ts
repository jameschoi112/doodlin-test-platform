import { test, expect, Page, TestInfo } from '@playwright/test';

interface ScreenshotReport {
  type: 'screenshot:add';
  payload: {
    failedStepIndex: number;
    screenshotBase64: string;
  };
}

test('stage 로그인 절차 진행', async ({ page }: { page: Page }, testInfo: TestInfo) => {
  const errors: Error[] = [];
  let stepIndex: number = 0;

  await test.step('Go to target URL', async () => {
    try {
      const targetUrl: string = process.env.TARGET_URL || 'https://app.staging.greetinghr.com/login?returnTo=L3dvcmtzcGFjZS8yMTgzL29wZW5pbmdz';
      await page.goto(targetUrl, { timeout: 15000 });
      await expect(page).toHaveTitle(/WEB2X/, { timeout: 5000 });
    } catch (error) {
      if (error instanceof Error) {
        errors.push(error);
      } else {
        errors.push(new Error(String(error)));
      }
      const screenshotBase64: string = (await page.screenshot()).toString('base64');
      const report: ScreenshotReport = { 
        type: 'screenshot:add', 
        payload: { 
          failedStepIndex: stepIndex, 
          screenshotBase64 
        } 
      };
      process.stdout.write(JSON.stringify(report) + '__END_OF_JSON__');
    }
    stepIndex++;
  });

  await test.step('Click "Do not show again" checkbox', async () => {
    try {
      // 5초 내에 요소를 찾지 못하면 타임아웃 에러 발생
      await page.locator('span.ant-typography.embla__isShowChec-wrong').click({ timeout: 5000 });
    } catch (error) {
      if (error instanceof Error) {
        errors.push(error);
      } else {
        errors.push(new Error(String(error)));
      }
      const screenshotBase64: string = (await page.screenshot()).toString('base64');
      const report: ScreenshotReport = { 
        type: 'screenshot:add', 
        payload: { 
          failedStepIndex: stepIndex, 
          screenshotBase64 
        } 
      };
      process.stdout.write(JSON.stringify(report) + '__END_OF_JSON__');
    }
    stepIndex++;
  });

  await test.step('Verify modal is closed', async () => {
    try {
      await expect(page.locator('div.ant-modal-conten')).not.toBeVisible({ timeout: 5000 });
    } catch (error) {
      if (error instanceof Error) {
        errors.push(error);
      } else {
        errors.push(new Error(String(error)));
      }
      const screenshotBase64: string = (await page.screenshot()).toString('base64');
      const report: ScreenshotReport = { 
        type: 'screenshot:add', 
        payload: { 
          failedStepIndex: stepIndex, 
          screenshotBase64 
        } 
      };
      process.stdout.write(JSON.stringify(report) + '__END_OF_JSON__');
    }
    stepIndex++;
  });

  // 모든 스텝이 끝난 후, 기록된 에러가 있으면 테스트를 실패 처리
  if (errors.length > 0) {
    throw new Error(`Test failed with ${errors.length} error(s). First error: ${errors[0].message}`);
  }
});
