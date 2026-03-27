# Taskify P2 작업 요약 (검토 요청용)

이번 단계에서는 **P2 공통 인프라 구축**까지만 진행하고 멈췄습니다.

## 1. 이번에 완료한 범위

### 1-1. API / 공통 상수

- API origin 상수 추가
- `teamId = 22-3` 상수 추가
- access token storage key 상수 추가

### 1-2. 공통 fetch 인프라

- `fetchData` 공통 유틸 구현
- query string 처리 지원
- JSON body 처리 지원
- `FormData` body 처리 지원
- 공통 `ApiError` 구현
- `401` 응답 시 공통 unauthorized handler 실행 구조 추가

### 1-3. 인증 저장소 / 인증 컨텍스트

- `localStorage` 기반 access token 저장 / 조회 / 삭제 유틸 구현
- `AuthProvider` 구현
- 앱 시작 시 토큰 존재 여부 확인
- 토큰이 있으면 `/users/me` 호출로 사용자 정보 bootstrap
- `login`, `logout`, `refreshUser` 동작 추가
- `401` 발생 시 토큰 제거 + `/login` 리다이렉트 구조 연결

### 1-4. 라우트 가드

- `ProtectedRoute` 구현
- `PublicOnlyRoute` 구현
- `/login`, `/signup`은 로그인 상태에서 접근 시 `/mydashboard`로 이동
- `/mydashboard`, `/dashboard/:dashboardId`, `/dashboard/:dashboardId/edit`, `/mypage`는 보호 라우트로 연결
- `/` 메인 페이지는 로그인 상태일 때 `/mydashboard`로 이동

### 1-5. 전역 overlay 인프라

- 전역 `ToastProvider` 구현
- 전역 `ModalProvider` 구현
- provider를 앱 최상단에 연결
- 이후 실제 페이지에서 바로 사용할 수 있는 `useToast`, `useModal` hook 추가

## 2. 생성 / 수정한 핵심 파일

### app

- `src/app/providers/index.tsx`
- `src/app/routes/index.tsx`
- `src/main.tsx`

### auth

- `src/features/auth/apis/authStorage.ts`
- `src/features/auth/apis/getMyInfo.ts`
- `src/features/auth/contexts/authContext.ts`
- `src/features/auth/contexts/authProvider.tsx`
- `src/features/auth/hooks/useAuth.ts`
- `src/features/auth/components/protected-route/index.tsx`
- `src/features/auth/components/public-only-route/index.tsx`
- `src/features/auth/components/route-gate-fallback/index.tsx`

### shared

- `src/shared/constants/api.ts`
- `src/shared/constants/storage.ts`
- `src/shared/api/fetch.ts`
- `src/shared/components/modal/index.tsx`
- `src/shared/components/modal/modalContext.ts`
- `src/shared/components/modal/useModal.ts`
- `src/shared/components/toast/index.tsx`
- `src/shared/components/toast/toastContext.ts`
- `src/shared/components/toast/useToast.ts`

### page update

- `src/pages/main/index.tsx`

### 문서

- `docs/p2-review-summary.md`

## 3. 현재 확인 가능한 상태

- `npm run lint` 통과
- `npm run build` 통과
- 인증 provider가 전역으로 연결됨
- 보호 라우트 / 공개 전용 라우트가 연결됨
- 공통 fetch 레이어에서 401 처리 구조가 연결됨
- toast / modal 인프라는 준비되었지만, 아직 실제 화면에서 소비하는 UI는 연결 전

## 4. 이번 단계에서 의도적으로 하지 않은 것

아래는 계획대로 **P3 이후 단계**로 넘겼습니다.

- 로그인 API 실제 연결
- 회원가입 API 실제 연결
- 로그인 / 회원가입 폼 검증
- 공통 Button / Input / Dropdown UI 구현
- 헤더 로그아웃 버튼 연결
- toast / modal을 실제 기능 플로우에 연결
- protected route 이후 세부 권한(owner 전용) 분기 처리

## 5. 검토가 필요한 포인트

### 꼭 확인 부탁

1. `fetchData + AuthProvider` 구조 방향이 괜찮은지
2. `localStorage` key 네이밍(`taskify.access-token`)이 괜찮은지
3. `ProtectedRoute / PublicOnlyRoute` 분리 방식이 괜찮은지
4. `ModalProvider`, `ToastProvider`를 지금 단계에서 전역으로 미리 넣어둔 방향이 괜찮은지

## 6. 다음 단계 예정 작업

승인되면 다음으로 아래를 진행하려고 합니다.

1. P3 인증 / 랜딩 실제 구현
  - 로그인 / 회원가입 실제 API 연결
  - 폼 검증
  - 에러 문구 반영
2. 공통 UI 기초 컴포넌트 구축
  - Button
  - Input
  - Modal UI 소비 컴포넌트
  - Dropdown
3. 인증 성공 후 흐름 완성
  - `/mydashboard` 진입
  - 사용자 정보 활용

