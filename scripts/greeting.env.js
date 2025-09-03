// Greeting 테스트 환경 설정
const GREETING_CONFIG = {
  // 기본값은 stage 환경
  defaultEnv: 'stage',
  
  // 환경별 URL 설정
  urls: {
    stage: 'https://app.staging.greetinghr.com',
    dev: 'https://app.dev.greetinghr.com',
    prod: 'https://app.greetinghr.com',
    preview: 'https://app.preview.greetinghr.com'
  },
  
  // 테스트 계정 정보
  testAccount: {
    email: 'jyc@doodlin.co.kr',
    password: '!!Wodud564866'
  },
  
  // 환경 가져오기 (환경변수에서 읽거나 기본값 사용)
  getCurrentEnv() {
    return process.env.GREETING_ENV || this.defaultEnv;
  },
  
  // 현재 환경의 URL 가져오기
  getCurrentUrl() {
    const env = this.getCurrentEnv();
    return this.urls[env] || this.urls[this.defaultEnv];
  },
  
  // 로그인 URL 가져오기
  getLoginUrl() {
    return `${this.getCurrentUrl()}/login`;
  }
};

module.exports = GREETING_CONFIG;
