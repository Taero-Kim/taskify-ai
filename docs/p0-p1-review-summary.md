# Taskify P0~P1 작업 요약 (검토 요청용)

이번 단계에서는 **P0와 P1까지만** 진행하고 멈췄습니다.

## 1. 이번에 완료한 범위

### P0

- 부트스트랩 방식 확정
  - Vite + React + TypeScript + npm
- 라우트 맵 문서화
- API 엔드포인트별 화면 사용처 문서화
- 문서에서 확인 가능한 디자인 토큰 정리
- Figma 접근이 현재 터미널 환경에서 막혀 있다는 점 기록

### P1

- React + TypeScript 프로젝트 초기화
- Tailwind 설정
- ESLint / Prettier / Husky 설정
- 절대경로 alias(`@`) 설정
- 기본 라우터 구성
- 문서 기준 폴더 구조 생성
- 주요 페이지 placeholder 생성

## 2. 생성 / 수정한 핵심 파일

### 문서

- `docs/p0-foundation-spec.md`
- `docs/p0-p1-review-summary.md`

### 설정

- `README.md`
- `package.json`
- `vite.config.ts`
- `tailwind.config.js`
- `postcss.config.js`
- `eslint.config.js`
- `tsconfig.app.json`
- `.prettierrc.json`
- `.prettierignore`
- `.husky/pre-commit`

### 앱 엔트리 / 라우트

- `src/main.tsx`
- `src/app/App.tsx`
- `src/app/routes/index.tsx`
- `src/app/routes/route-path.ts`
- `src/app/styles/globals.css`
- `src/app/styles/colors.ts`

### 공통 유틸

- `src/shared/utils/cn.ts`

### 페이지 스켈레톤

- `src/pages/main/*`
- `src/pages/login/*`
- `src/pages/signup/*`
- `src/pages/mydashboard/*`
- `src/pages/dashboard/*`
- `src/pages/dashboard-edit/*`
- `src/pages/mypage/*`
- `src/pages/not-found/*`

### 구조용 디렉터리

- `src/features/`**
- `src/shared/components/**`
- `src/shared/hooks`
- `src/shared/api`
- `src/shared/constants`
- `src/shared/types`
- `src/shared/assets/**`

## 3. 현재 확인 가능한 상태

- `npm run lint` 통과
- `npm run build` 통과
- 페이지 라우트는 모두 placeholder 수준으로 연결됨
- 인증 / fetch / context / route guard는 **아직 미구현**

## 4. 이번 단계에서 의도적으로 하지 않은 것

아래는 계획대로 **다음 단계(P2 이후)** 로 넘겼습니다.

- 공통 fetch 구현
- auth storage / auth context 구현
- 401 공통 처리
- protected route
- toast / modal 시스템
- 실제 페이지 UI 구현
- API 연동

## 5. 검토가 필요한 포인트

### 꼭 확인 부탁

1. `Vite + npm` 시작 방향 괜찮은지
2. `pages/dashboard-edit` 디렉터리 naming 괜찮은지
3. 현재 placeholder 페이지 구성 방식 괜찮은지
4. Figma를 내가 직접 읽을 수 없는 상황에서,
  문서 기반 토큰만 먼저 반영한 방식이 괜찮은지

## 6. 다음 단계 예정 작업

승인되면 다음으로 아래를 진행하려고 합니다.

1. P2 공통 인프라 구축
  - API base / teamId 상수
  - fetch 유틸
  - auth storage
  - auth context
  - 401 리다이렉트 처리
2. 공통 UI 기초 컴포넌트 구축
3. 인증 페이지 실제 구현

