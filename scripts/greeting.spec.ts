import { test, expect, Page, TestInfo } from '@playwright/test';
import GREETING_CONFIG from './greeting.env.js';

interface ScreenshotReport {
  type: 'screenshot:add';
  payload: {
    failedStepIndex: number;
    screenshotBase64: string;
    environment: string;
    testName: string;
  };
}

// 계정 및 비밀번호 오류 케이스
// 랜덤 이메일 생성 
function generateRandomEmail(): string {
  const randomString = Math.random().toString(36).substring(2, 15);
  return `test_${randomString}@example.com`;
}

// 랜덤 비밀번호 생성
function generateRandomPassword(): string {
  const randomString = Math.random().toString(36).substring(2, 15);
  return `pass_${randomString}123`;
}

test('Greeting 로그인 기능 테스트', async ({ page }: { page: Page }, testInfo: TestInfo) => {
  const errors: Error[] = [];
  let stepIndex: number = 0;
  const currentEnv = GREETING_CONFIG.getCurrentEnv();
  const currentUrl = GREETING_CONFIG.getCurrentUrl();

  console.log(`테스트 환경: ${currentEnv}`);
  console.log(`테스트 URL: ${currentUrl}`);

  await test.step('로그인 페이지 진입 확인', async () => {
    try {
      console.log(`브라우저 실행 및 페이지 이동: ${GREETING_CONFIG.getLoginUrl()}`);
      await page.goto(GREETING_CONFIG.getLoginUrl(), { timeout: 15000 });
      
      // Greeting 로고 표시 확인
      await expect(page.getByRole('link', { name: 'Greeting Logo' })).toBeVisible({ timeout: 2000 });
      console.log('Greeting 로고 표시 확인 완료');
      
      // 언어 체크 (playwright로 접근 시 기본 언어가 영어로 설정되어 있어 한국어로 변경)
      try {
        // 한국어 버튼이 보이는지 확인
        const koreanButton = page.getByRole('button', { name: '한국어' });
        const isKoreanVisible = await koreanButton.isVisible({ timeout: 1000 });

       
        if (isKoreanVisible) {
          console.log('로그인 페이지 언어가 이미 한국어로 설정되어 있습니다. 다음 단계로 진행합니다.');
        } else {
          console.log('한국어가 아닌 언어로 설정되어 있습니다. 한국어로 변경합니다.');
          
          // 언어 변경 버튼 클릭
          await page.getByRole('button', { name: 'English' }).click();
          
          // 모달이 나타날 때까지 기다리기 (더 안정적인 방법)
          await page.waitForSelector('[role="option"]', { state: 'visible', timeout: 3000 });
          
          // 한국어 옵션 클릭
          await page.getByRole('option', { name: '한국어' }).click();
          
          // 모달이 사라질 때까지 기다리기
          await page.waitForSelector('[role="option"]', { state: 'hidden', timeout: 3000 });
          
          console.log('언어를 한국어로 변경 완료');
        }
      } catch (languageError) {
        console.log('언어 설정 관련 요소를 찾을 수 없습니다. 기본 설정으로 진행합니다.');
      }
      
      // 로그인 텍스트 출력 확인
      await expect(page.getByText('로그인', { exact: true })).toBeVisible({ timeout: 5000 });
      console.log('로그인 텍스트 출력 확인 완료');
      
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
          screenshotBase64,
          environment: currentEnv,
          testName: '로그인 페이지 진입 확인'
        } 
      };
      process.stdout.write(JSON.stringify(report) + '__END_OF_JSON__');
    }
    stepIndex++;
  });

  await test.step('로그인 실패 케이스 테스트', async () => {
    try {
      console.log('로그인 실패 케이스 테스트 시작');
      
      // 계정 이메일 입력필드에 랜덤한 이메일 주소 입력
      const randomEmail = generateRandomEmail();
      await page.getByRole('textbox', { name: '계정 이메일' }).click();
      await page.getByRole('textbox', { name: '계정 이메일' }).fill(randomEmail);
      console.log(`랜덤 이메일 입력: ${randomEmail}`);
      
      // 계정 비밀번호 입력필드에 랜덤한 비밀번호 입력
      const randomPassword = generateRandomPassword();
      await page.getByRole('textbox', { name: '비밀번호' }).fill(randomPassword);
      console.log(`랜덤 비밀번호 입력: ${randomPassword}`);
      
      // 이메일로 로그인 버튼 선택
      await page.getByRole('button', { name: '이메일로 로그인' }).click();
      console.log('로그인 버튼 클릭 완료');
      
      // 비밀번호 오류 후 표시되는 에러 문구 체크
      await expect(page.getByText('가입하지 않은 이메일이거나, 잘못된 비밀번호입니다')).toBeVisible({ timeout: 5000 });
      console.log('에러 메시지 표시 확인 완료');
      
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
          screenshotBase64,
          environment: currentEnv,
          testName: '로그인 실패 케이스 테스트'
        } 
      };
      process.stdout.write(JSON.stringify(report) + '__END_OF_JSON__');
    }
    stepIndex++;
  });

  await test.step('로그인 성공 케이스 테스트', async () => {
    try {
      console.log('로그인 성공 케이스 테스트 시작');
      
      // 계정 이메일 입력필드에 정상적인 이메일 주소 입력
      await page.getByRole('textbox', { name: '계정 이메일' }).fill(GREETING_CONFIG.testAccount.email);
      console.log(`정상 이메일 입력: ${GREETING_CONFIG.testAccount.email}`);
      
      // 계정 비밀번호 입력필드에 정상적인 비밀번호 입력
      await page.getByRole('textbox', { name: '비밀번호' }).fill(GREETING_CONFIG.testAccount.password);
      console.log('정상 비밀번호 입력 완료');
      
      // 이메일로 로그인 버튼 선택
      await page.getByRole('button', { name: '이메일로 로그인' }).click();
      console.log('로그인 버튼 클릭 완료');
      
      // 로그인 후 팝업 표시 확인 및 닫기
      try {
        //await page.locator('div').filter({ hasText: '년 08월 06' }).nth(3).click({ timeout: 5000 });
        //console.log('날짜 팝업 표시 확인 완료');
        await page.getByRole('button', { name: 'close' }).click();
        console.log('팝업 닫기 완료');
      } catch (popupError) {
        console.log('팝업이 표시되지 않았습니다 (정상적인 경우)');
      }
      
      // 로그인 후 페이지에 표시되는 공고라는 문구를 체크하여 로그인을 정상적으로 진입했는지 확인
      await expect(page.getByRole('link', { name: '공고', exact: true })).toBeVisible({ timeout: 10000 });
      console.log('공고 링크 표시 확인 완료 - 로그인 성공!');
      
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
          screenshotBase64,
          environment: currentEnv,
          testName: '로그인 성공 케이스 테스트'
        } 
      };
      process.stdout.write(JSON.stringify(report) + '__END_OF_JSON__');
    }
    stepIndex++;
  });

  // 모든 스텝이 끝난 후, 기록된 에러가 있으면 테스트를 실패 처리
  if (errors.length > 0) {
    console.error(`테스트 실패: ${errors.length}개의 에러 발생`);
    errors.forEach((error, index) => {
      console.error(`에러 ${index + 1}: ${error.message}`);
    });
    throw new Error(`Test failed with ${errors.length} error(s). First error: ${errors[0].message}`);
  } else {
    console.log('모든 테스트 단계가 성공적으로 완료되었습니다!');
  }
});
