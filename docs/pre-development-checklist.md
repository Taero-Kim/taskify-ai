# Taskify 개발 전 보완사항 및 확인 질문

프로젝트 문서와 API 명세를 검토한 결과, 기본 개발은 시작할 수 있는 수준이지만 실제 구현 전에 아래 사항들을 먼저 정리하면 좋습니다.

## 1. 먼저 보완하면 좋은 점

### 1-1. API 기준값 충돌

- `docs/api-spec.md`: `teamId === 3`
- `docs/requirements.md`: `API_BASE_URL = https://sp-taskify-api.vercel.app/22-3/`
- 실제 개발 시 사용할 **정확한 teamId / base URL 기준값 확정**이 필요합니다.

답변: "22-3"을 teamId로 사용해줘.

### 1-2. 디자인 자료 부족

- `docs/page-component.md`는 화면 구성 초안 성격이 강합니다.
- 실제 구현용으로는 아래 자료가 더 필요합니다.
  - Figma 링크
  - 실제 이미지 에셋
  - 폰트 정보
  - 컴포넌트별 상세 디자인 기준

답변: 피그마 링크를 첨부해줄게. https://www.figma.com/design/FqfFEBAvqN3Cl05hMTQwlP/Taskify

### 1-3. 디자인 시스템 토큰 부족

현재 문서에는 primary color만 정의되어 있습니다.

추가로 아래 항목이 있으면 구현과 공통 컴포넌트 설계가 훨씬 수월합니다.

- gray scale
- semantic color (`success`, `error`, `warning`)
- font size / font weight / line-height
- spacing
- border radius
- shadow

답변: 피그마 링크에 정리되어 있음

### 1-4. 폴더 구조 / 네이밍 규칙 일부 모호

- TypeScript 프로젝트인데 `docs/convention.md`에는 일부가 `js` 기준으로 적혀 있습니다.
- `FSD 방식`이라고 되어 있지만 실제 구조는 일반적인 완전한 FSD 구조와는 다소 다릅니다.
- 따라서 아래를 먼저 정하면 좋습니다.
  - 모든 로직 파일을 `.ts` / `.tsx`로 통일할지
  - 현재 제안된 구조를 그대로 사용할지
  - `entities`, `widgets` 같은 레이어를 추가하지 않을지

답변: 현재 제안된 구조를 사용해줘. 또 js 관련 내용은 무시해도 좋아.

### 1-5. 커밋 규칙 충돌

- `docs/convention.md`: 이모지 커밋 컨벤션
- 현재 작업 환경 AGENTS 규칙: Lore Commit Protocol
- 실제 작업 시 **어느 커밋 규칙을 우선 적용할지** 합의가 필요합니다.

답변: 내가 정의한 커밋 규칙을 우선 적용해줘.

## 2. 개발 전에 꼭 확인하고 싶은 질문

### 2-1. 인증 토큰 저장 방식

- `localStorage`, `sessionStorage`, 메모리 중 어떤 방식으로 저장할지 확인 필요
- 401 응답 시 공통 로그아웃 / 로그인 페이지 리다이렉트 처리 여부도 결정 필요

답변: localStoragedp 저장하고, 401 응답시 로그인 페이지로 리다이렉트

### 2-2. 로그인 사용자의 첫 진입 경로

요구사항에는 `/` 접속 시 로그인 상태이면 `/dashboard/{첫 번째 dashboardId}`로 이동한다고 되어 있습니다.

- 대시보드가 하나도 없으면 `/mydashboard`로 보내도 되는지

답변: 두 경우 모두 `/mydashboard` 로 보냄

### 2-3. 멤버 권한 범위

- owner만 가능한 기능이 어디까지인지
  - 대시보드 수정
  - 멤버 삭제
  - 초대
- 일반 멤버도 카드/컬럼 생성, 수정, 삭제가 가능한지

답변: 위에 너가 언급한 내용이 모두 정확함.

### 2-4. 카드 이동 규칙

요구사항상 컬럼 간 카드 이동은 필요합니다.

추가 확인 필요:

- 같은 컬럼 내부에서 카드 순서 변경도 필요한지
- Swagger 상에는 `columnId` 변경은 보이지만, 카드 정렬 순서 관련 필드는 명확하지 않음

답변: 같은 컬럼 내부에서 카드 순서 변경도 가능. 카드 정렬 순서 관련 필드는 따로 없고, index 기반 관리

### 2-5. 알림 UI 기준

문서에 아래 표현이 혼재되어 있습니다.

- `alert`
- 경고창
- 모달

확인 필요:

- 브라우저 기본 `alert`, `confirm` 허용 여부
- 아니면 커스텀 모달 / 토스트로 통일할지

답변: 커스텀 모달이나 토스트로 통일해줘

### 2-6. 상태 관리 범위

문서에는 `fetch`, `Context API`가 적혀 있습니다.

확인 필요:

- 정말 `fetch + Context API`만 사용할지
- 아니면 pagination / infinite scroll 대응을 위해 서버 상태 관리 라이브러리 사용이 가능한지

답변: fetch와 context api 및 react 기능들만 사용

### 2-7. 드래그 앤 드롭 라이브러리 사용 여부

- 카드 이동 UX 구현을 위해 DnD 라이브러리 사용 허용 여부 확인 필요

답변: 일단 사용 안함

### 2-8. 반응형 우선순위

- 모바일 퍼스트는 정해져 있음
- 다만 대시보드 상세 화면에서 모바일일 때 아래 기준이 필요함
  - sidebar 처리 방식
  - board 가로 스크롤 방식
  - header 액션 버튼 노출 방식

답변:

- 사이드바는 너비가 축소되고 컬러만 표시됨
- 대시보드는 모든 컬럼을 세로로 표시 (가로 스크롤은 하지 않음)
- 헤더 액션 버튼은 크기가 축소된채로 그대로 디스플레이

### 2-9. 검색 / 에러 메시지 기준

확인 필요:

- 초대 목록 검색을 API 기반으로 할지, 클라이언트 필터링으로 할지
- 문서에 적힌 한국어 에러 문구를 그대로 고정해서 사용할지

답변: 클라이언트 필터링

## 3. 현재 확인한 API 포인트

Swagger 문서 기준 확인한 주요 API는 아래와 같습니다.

- Auth
- Users
- Dashboards
- Invitations
- Members
- Columns
- Cards
- Comments
- Card Image Upload
- Profile Image Upload

Swagger:

- [https://sp-taskify-api.vercel.app/docs/](https://sp-taskify-api.vercel.app/docs/)

## 4. 권장 개발 진행 순서

질문/기준이 정리되면 아래 순서로 진행하는 것이 적절합니다.

1. 프로젝트 초기 셋업
2. 라우팅 + 폴더 구조 확정
3. 공통 UI / 레이아웃 구축
4. 인증
5. 대시보드 / 컬럼 / 카드 / 댓글 기능 순차 구현

## 5. 검토한 문서

- `docs/requirements.md`
- `docs/folder-structure.md`
- `docs/convention.md`
- `docs/tech-spec.md`
- `docs/page-component.md`
- `docs/api-spec.md`
- Swagger API 문서
