#!/bin/bash

# Greeting 테스트 환경 설정 스크립트
# 사용법: source set-env.sh [stage|dev|prod|preview]

# 기본값은 stage
DEFAULT_ENV="stage"

# 환경 설정
if [ -z "$1" ]; then
    ENV=$DEFAULT_ENV
else
    ENV=$1
fi

# 환경 유효성 검사
case $ENV in
    "stage"|"dev"|"prod"|"preview")
        echo "✅ 환경이 $ENV로 설정되었습니다."
        ;;
    *)
        echo "❌ 잘못된 환경입니다. 사용 가능한 환경: stage, dev, prod, preview"
        echo "기본값인 $DEFAULT_ENV를 사용합니다."
        ENV=$DEFAULT_ENV
        ;;
esac

# 환경변수 설정
export GREETING_ENV=$ENV

echo "🌍 GREETING_ENV=$GREETING_ENV"
echo "🔗 테스트 URL: https://app.${ENV}.greetinghr.com"

# 현재 환경 정보 출력
case $ENV in
    "stage")
        echo "📋 Stage 환경 - 개발 테스트용"
        ;;
    "dev")
        echo "🔧 Dev 환경 - 개발자 테스트용"
        ;;
    "prod")
        echo "🚀 Production 환경 - 실제 운영 환경 (주의!)"
        ;;
    "preview")
        echo "👀 Preview 환경 - 배포 전 검증용"
        ;;
esac

echo ""
echo "💡 테스트 실행 방법:"
echo "   npx playwright test scripts/greeting.spec.ts"
echo ""
echo "💡 다른 환경으로 변경하려면:"
echo "   source set-env.sh [stage|dev|prod|preview]"
