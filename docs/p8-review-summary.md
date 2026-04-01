# Taskify P8 작업 요약

이번 진행에서는 **마이페이지(Account Management)** 를 구현했습니다.

## 1. 완료한 범위

### 1-1. 프로필 수정

- `/mypage` 실제 화면 구현
- 현재 사용자 정보 표시
- 이메일 read-only 처리
- 닉네임 수정 구현
- 프로필 이미지 업로드 흐름 구현
- 닉네임 또는 이미지 변경 시에만 저장 버튼 활성화
- 저장 후 `/users/me` 정보 재조회

### 1-2. 비밀번호 변경

- 현재 비밀번호 / 새 비밀번호 / 새 비밀번호 확인 폼 구현
- 새 비밀번호 길이 검증 추가
- 새 비밀번호 확인 mismatch 검증 추가
- 모든 입력이 채워지고 오류가 없을 때만 변경 버튼 활성화
- 비밀번호 변경 API 연동
- 현재 비밀번호 오류 시 커스텀 모달 표시

### 1-3. 관련 API 추가

- `changePassword`
- `updateMyInfo`
- `uploadMyImage`

## 2. 생성 / 수정 파일

- `src/features/auth/apis/changePassword.ts`
- `src/features/user/apis/updateMyInfo.ts`
- `src/features/user/apis/uploadMyImage.ts`
- `src/pages/mypage/index.tsx`
- `docs/p8-review-summary.md`

## 3. 검증

- `npm run lint` 통과
- `npm run build` 통과

## 4. 현재 남은 큰 작업

- QA / 예외 케이스 정리
- 반응형 디테일 보정
- 일부 UX 세부 polish
- 필요 시 카드 이동 UX 개선

