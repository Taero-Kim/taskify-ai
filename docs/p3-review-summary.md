# Taskify P3 작업 요약 (검토 요청용)

이번 단계에서는 **P3 랜딩 / 인증 실제 구현**까지 진행하고 멈췄습니다.

## 1. 이번에 완료한 범위

### 1-1. 랜딩 페이지 구현

- `/` 메인 랜딩 페이지를 실제 UI 형태로 교체
- 로고 버튼 구현
- 로그인 / 회원가입 CTA 버튼 구현
- 소개 섹션과 간단한 보드 프리뷰 추가
- 로그인 상태에서는 `/mydashboard`로 리다이렉트 유지

### 1-2. 공통 폼 UI 추가

- 재사용 가능한 `Button` 컴포넌트 구현
- 재사용 가능한 `Input` 컴포넌트 구현
- 이메일 / 비밀번호 / 일반 입력 필드에 공통 스타일 적용
- 비밀번호 보기/숨기기 버튼 컴포넌트 구현
- 인증 페이지 공통 레이아웃(`AuthFormLayout`) 구현

### 1-3. 로그인 페이지 실제 구현

- `/login` 페이지 실제 폼 구현
- 로고 클릭 시 `/` 이동
- `회원가입하기` 링크 구현
- 이메일 blur 검증 구현
- 비밀번호 blur 검증 구현
- 비밀번호 보기/숨기기 기능 구현
- 로그인 API 연동 추가
- 로그인 성공 시 access token 저장 + `/mydashboard` 이동
- 보호 라우트에서 넘어온 redirect 경로가 있으면 해당 경로 우선 이동
- 로그인 실패 시 커스텀 모달 표시

### 1-4. 회원가입 페이지 실제 구현

- `/signup` 페이지 실제 폼 구현
- 로고 클릭 시 `/` 이동
- `로그인하기` 링크 구현
- 닉네임 / 이메일 / 비밀번호 / 비밀번호 확인 검증 구현
- 이용약관 체크박스 추가
- 모든 입력값이 채워지고 오류가 없고 약관 동의가 되어야 `가입하기` 활성화
- 회원가입 API 연동 추가
- 중복 이메일(409) 시 커스텀 모달 표시
- 회원가입 성공 시 커스텀 모달 표시 후 `/login` 이동 흐름 구현

### 1-5. 공통 유틸 추가

- 이메일 검증 유틸 추가
- 비밀번호 길이 검증 유틸 추가
- 닉네임 길이 검증 유틸 추가
- 로그인 API 함수 추가
- 회원가입 API 함수 추가

## 2. 생성 / 수정한 핵심 파일

### auth / user api

- `src/features/auth/apis/login.ts`
- `src/features/user/apis/createUser.ts`

### auth components

- `src/features/auth/components/auth-form/index.tsx`
- `src/features/auth/components/password-visibility-button/index.tsx`

### shared components / utils

- `src/shared/components/button/index.tsx`
- `src/shared/components/button/buttonVariants.ts`
- `src/shared/components/input/index.tsx`
- `src/shared/utils/validateEmail.ts`
- `src/shared/utils/validatePassword.ts`
- `src/shared/utils/validateNickname.ts`

### page updates

- `src/pages/main/index.tsx`
- `src/pages/login/index.tsx`
- `src/pages/login/login.constants.ts`
- `src/pages/login/login.types.ts`
- `src/pages/signup/index.tsx`
- `src/pages/signup/signup.constants.ts`
- `src/pages/signup/signup.types.ts`

### 문서

- `docs/p3-review-summary.md`

## 3. 현재 확인 가능한 상태

- `npm run lint` 통과
- `npm run build` 통과
- 랜딩 / 로그인 / 회원가입 화면이 실제 UI 상태로 바뀜
- 로그인 / 회원가입 API 호출 코드가 연결됨
- 인증 성공 후 P2의 auth context와 연결됨
- 에러 알림은 브라우저 alert 대신 커스텀 modal로 처리됨

## 4. 이번 단계에서 의도적으로 하지 않은 것

아래는 계획대로 **P4 이후 단계**로 넘겼습니다.

- 내 대시보드 실제 목록 조회
- 헤더 사용자 드롭다운
- 사이드바
- 대시보드 생성 모달
- 공통 Dropdown 구현
- 디자인 세부 토큰(Figma 기반 typo/spacing/shadow 완전 반영)
- 로그인 / 회원가입 화면의 최종 디자인 디테일 조정

## 5. 검토가 필요한 포인트

### 꼭 확인 부탁

1. 랜딩 페이지의 현재 레이아웃 방향이 괜찮은지
2. 로그인 실패 메시지를 `400` 기준으로 `비밀번호가 일치하지 않습니다.`로 처리한 방식이 괜찮은지
3. 회원가입 성공을 커스텀 모달로 처리한 방식이 괜찮은지
4. 공통 `Button`, `Input` 컴포넌트의 방향이 괜찮은지

## 6. 다음 단계 예정 작업

승인되면 다음으로 아래를 진행하려고 합니다.

1. P4 내 대시보드 구현

- 내 대시보드 목록 조회
- 초대 목록 무한 스크롤
- 검색
- 대시보드 생성 모달

2. 공통 레이아웃 요소 확장

- 헤더
- 사이드바

3. 공통 Dropdown / 카드형 UI 추가
