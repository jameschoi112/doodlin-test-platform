# Doodlin Test Platform

웹 애플리케이션 테스트를 위한 통합 플랫폼입니다.

## 주요 기능

- **자동화 테스트 실행**: Playwright를 사용한 웹 테스트 자동화
- **실시간 테스트 모니터링**: 웹소켓을 통한 실시간 테스트 상태 추적
- **스크린샷 캡처**: 테스트 실패 시 자동 스크린샷 저장
- **다중 환경 지원**: Stage, Dev, Production, Preview 환경별 테스트
- **테스트 케이스 관리**: Firebase 기반 테스트 케이스 저장 및 관리

## Greeting 테스트

### 환경 설정

프로젝트는 4가지 환경을 지원합니다:

- **Stage** (기본값): 개발 테스트용
- **Dev**: 개발자 테스트용  
- **Production**: 실제 운영 환경
- **Preview**: 배포 전 검증용

### 환경변수 설정

```bash
# Stage 환경 설정 (기본값)
source scripts/set-env.sh

# Dev 환경 설정
source scripts/set-env.sh dev

# Production 환경 설정
source scripts/set-env.sh prod

# Preview 환경 설정
source scripts/set-env.sh preview
```

### Greeting 테스트 실행

```bash
# 환경변수 설정 후
npx playwright test scripts/greeting.spec.ts
```

### 테스트 시나리오

1. **로그인 페이지 진입 확인**
   - 브라우저 실행 및 페이지 이동
   - URL 및 로그인 텍스트 확인

2. **로그인 실패 케이스 테스트**
   - 랜덤 이메일/비밀번호 입력
   - 에러 메시지 표시 확인

3. **로그인 성공 케이스 테스트**
   - 정상 계정 정보 입력
   - 팝업 처리 및 로그인 후 페이지 확인

## 프로젝트 구조

```
scripts/
├── greeting.spec.ts          # Greeting 전용 테스트 파일
├── greeting.env.js           # 환경 설정 파일
├── set-env.sh               # 환경변수 설정 스크립트
└── web2x.spec.ts            # 기존 WEB2X 테스트 파일

src/
├── components/
│   ├── AddTestModal.js       # 테스트 추가 모달 (환경 선택 포함)
│   ├── TestList.js           # 테스트 목록 (환경 정보 표시)
│   └── TestDetail.js         # 테스트 상세 (환경 정보 표시)
└── ...
```

## 설치 및 실행

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm start
```

### 테스트 실행

```bash
# 전체 테스트
npm test

# 특정 테스트 파일
npx playwright test scripts/greeting.spec.ts
```

## 환경별 URL

- **Stage**: https://app.staging.greetinghr.com
- **Dev**: https://app.dev.greetinghr.com  
- **Production**: https://app.greetinghr.com
- **Preview**: https://app.preview.greetinghr.com

## 주의사항

- Production 환경 테스트 시 주의가 필요합니다
- 테스트 계정 정보는 환경 설정 파일에서 관리됩니다
- 스크린샷은 테스트 실패 시 자동으로 캡처됩니다

## 기술 스택

- **Frontend**: React, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, Socket.io
- **Database**: Firebase Firestore
- **Testing**: Playwright
- **Build Tool**: Create React App
