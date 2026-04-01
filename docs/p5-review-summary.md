# Taskify P5 작업 요약 (검토 요청용)

이번 단계에서는 **P5 대시보드 상세 구현**을 진행했습니다.

## 1. 이번에 완료한 범위

### 1-1. 대시보드 상세 페이지 구현

- `/dashboard/:dashboardId` 페이지를 실제 화면으로 교체
- 대시보드 상세 정보 API 연동
- 헤더에 대시보드 제목, 왕관 표시, 관리 버튼, 초대하기 버튼, 멤버 아바타 표시
- 데스크탑에서는 컬럼이 가로 배치되고, 모바일에서는 세로 배치되도록 구현
- 사이드바 대시보드 페이지네이션 유지

### 1-2. 컬럼 / 카드 조회 흐름 구현

- 컬럼 목록 API 연동
- 각 컬럼별 카드 목록 API 연동
- 컬럼별 카드 개수 표시
- 각 컬럼의 카드 목록 무한 스크롤 구현
- 카드 클릭 시 상세 모달이 열리도록 연결
- 컬럼 추가 / 컬럼 관리 / 새 카드 추가 버튼은 우선 placeholder modal로 연결

### 1-3. 카드 상세 모달 + 댓글 흐름 구현

- 카드 상세 조회 API 연동
- 카드 제목 / 설명 / 태그 / 마감일 / 담당자 표시
- 댓글 목록 API 연동
- 댓글 무한 스크롤 구현
- 댓글 입력 폼 구현
- 댓글 입력 버튼 비활성화 조건 적용
- 댓글 생성 API 연동

### 1-4. 초대하기 흐름 구현

- 대시보드 상세의 `초대하기` 버튼 구현
- 이메일 입력 모달 구현
- 이메일 형식 검증 구현
- 초대 API 연동
- 초대 성공 / 실패 토스트 처리

### 1-5. 대시보드 관련 공통 API/유틸 추가

- 대시보드 상세 조회 API 추가
- 멤버 목록 조회 API 추가
- 컬럼 목록 조회 API 추가
- 카드 목록 / 카드 상세 조회 API 추가
- 댓글 목록 / 댓글 생성 API 추가
- 초대 생성 API 추가
- 날짜 포맷 유틸 추가

## 2. 생성 / 수정한 핵심 파일

### dashboard / column / card / comment api

- `src/features/dashboard/apis/getDashboard.ts`
- `src/features/dashboard/apis/getMembers.ts`
- `src/features/dashboard/apis/createInvitation.ts`
- `src/features/column/apis/column.types.ts`
- `src/features/column/apis/getColumns.ts`
- `src/features/card/apis/card.types.ts`
- `src/features/card/apis/getCard.ts`
- `src/features/card/apis/getCards.ts`
- `src/features/comment/apis/comment.types.ts`
- `src/features/comment/apis/getComments.ts`
- `src/features/comment/apis/createComment.ts`

### dashboard / shared components

- `src/features/dashboard/components/create-dashboard-modal-content/index.tsx`
- `src/shared/components/header/index.tsx`
- `src/shared/utils/formatDate.ts`

### page update

- `src/pages/dashboard/index.tsx`
- `src/pages/mydashboard/index.tsx` (생성 모달 공통 컴포넌트 적용)

### 문서

- `docs/p5-review-summary.md`

## 3. 현재 확인 가능한 상태

- `npm run lint` 통과
- `npm run build` 통과
- `/dashboard/:dashboardId`가 실제 데이터 기반 페이지로 동작 가능
- 카드 상세 모달과 댓글 등록 흐름까지 연결됨
- 초대하기 모달이 실제 API와 연결됨

## 4. 이번 단계에서 의도적으로 하지 않은 것

아래는 계획대로 **다음 단계**로 넘겼습니다.

- 컬럼 생성 / 수정 / 삭제 실제 구현
- 카드 생성 / 수정 / 삭제 실제 구현
- 댓글 수정 / 삭제 구현
- 카드 이미지 업로드 연동
- 컬럼 간 카드 이동 / 같은 컬럼 내 카드 순서 변경 구현
- 대시보드 수정 페이지 실구현

## 5. 검토가 필요한 포인트

### 꼭 확인 부탁

1. 대시보드 상세의 현재 레이아웃 방향이 괜찮은지
2. 컬럼/카드 생성 관련 버튼을 placeholder modal로 둔 현재 방식이 괜찮은지
3. 카드 상세 모달의 정보 밀도와 댓글 배치가 괜찮은지
4. 초대하기를 대시보드 상세에서도 바로 연결한 방향이 괜찮은지

## 6. 다음 단계 예정 작업

승인되면 다음으로 아래를 진행하려고 합니다.

1. 카드 / 컬럼 생성, 수정, 삭제 구현
2. 대시보드 수정 페이지 구현
3. 댓글 수정 / 삭제 구현
4. 카드 이동 및 정렬 처리 구현
