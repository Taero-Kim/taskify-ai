# 대시보드 생성 모달 Router Context 오류 수정 보고

## 문제 현상

- `/mydashboard`에서 `대시보드 생성` 클릭 시 아래 에러 발생
- `useNavigate() may be used only in the context of a <Router> component.`

## 정확한 원인

원인은 `ModalProvider`의 위치였습니다.

기존 구조:

- `main.tsx`
  - `<AppProviders>`
    - `<RouterProvider />`

그리고 `AppProviders` 내부에서:

- `AuthProvider`
- `ToastProvider`
- `ModalProvider`
- `children`

즉, `ModalProvider`가 `RouterProvider`의 **바깥**에 있었습니다.

`DashboardCreateModalContent`는 `ModalProvider`가 띄우는 모달 콘텐츠였고,
그 안에서 `useNavigate()`를 사용하고 있었습니다.

하지만 이 모달 콘텐츠는 React Router context의 자식이 아니라,
**RouterProvider보다 위쪽 트리에서 렌더링되는 구조**였기 때문에
`useNavigate()`가 Router context를 찾지 못하고 에러가 발생했습니다.

## 해결 방법

Provider 위치를 재구성했습니다.

변경 전:

- `main.tsx`에서 `AppProviders`가 `RouterProvider`를 감쌈

변경 후:

- `main.tsx`는 `RouterProvider`만 렌더링
- `src/app/App.tsx`에서 `AppProviders`가 `Outlet`을 감싸도록 변경

즉, 모든 modal/toast/auth provider가 이제
**RouterProvider 내부에서 렌더링**되도록 옮겼습니다.

## 결과

- 대시보드 생성 모달에서 `useNavigate()` 사용 가능
- `대시보드 생성` 클릭 후 생성 성공 시 상세 페이지 이동 동작 정상화
- router context가 필요한 다른 modal 콘텐츠도 동일 구조에서 안전하게 동작 가능

## 검증

- `npm run lint` 통과
- `npm run build` 통과

## 수정 파일

- `src/main.tsx`
- `src/app/App.tsx`
- `docs/modal-router-context-fix-report.md`
