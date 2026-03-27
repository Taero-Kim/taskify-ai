# Taskify P0 정리

P0 범위에서 확정하거나 정리한 내용을 모아둔 문서입니다.

## 1. 부트스트랩 결정

### 선택

- **Vite + React + TypeScript + npm** 기반으로 프로젝트를 시작합니다.

### 선택 이유

- 현재 저장소는 아직 애플리케이션 코드가 없는 초기 상태입니다.
- `docs/tech-spec.md`의 React + TypeScript 요구사항을 가장 빠르게 충족할 수 있습니다.
- Vite 기본 빌드 속도가 빠르고 Tailwind / React Router 연동이 간단합니다.

## 2. 라우트 맵 확정

현재 구현 기준 라우트는 아래와 같이 확정합니다.


| 경로                             | 목적                | 비고                                        |
| ------------------------------ | ----------------- | ----------------------------------------- |
| `/`                            | 메인 랜딩 페이지         | 로그인 상태일 때 이후 단계에서 `/mydashboard` 리다이렉트 예정 |
| `/login`                       | 로그인               | public route                              |
| `/signup`                      | 회원가입              | public route                              |
| `/mydashboard`                 | 내 대시보드 목록 / 초대 목록 | authenticated route 예정                    |
| `/dashboard/:dashboardId`      | 대시보드 상세           | authenticated route 예정                    |
| `/dashboard/:dashboardId/edit` | 대시보드 수정           | owner 권한 확인 예정                            |
| `/mypage`                      | 내 정보 / 비밀번호 변경    | authenticated route 예정                    |
| `*`                            | 404 처리            | fallback                                  |


### 라우트로 분리하지 않은 흐름

아래는 라우트가 아닌 **모달 기반 흐름**으로 유지합니다.

- 대시보드 생성
- 초대하기
- 카드 상세
- 카드 생성 / 수정
- 컬럼 생성 / 수정

## 3. API 사용 화면 매핑

Swagger 기준 주요 엔드포인트와 화면 매핑은 아래와 같습니다.


| API                                                             | 메서드    | 사용 화면 / 목적                                                |
| --------------------------------------------------------------- | ------ | --------------------------------------------------------- |
| `/{teamId}/auth/login`                                          | POST   | `/login` 로그인                                              |
| `/{teamId}/auth/password`                                       | PUT    | `/mypage` 비밀번호 변경                                         |
| `/{teamId}/users`                                               | POST   | `/signup` 회원가입                                            |
| `/{teamId}/users/me`                                            | GET    | 앱 초기 사용자 정보 조회, `/mypage`, 헤더 사용자 영역                      |
| `/{teamId}/users/me`                                            | PUT    | `/mypage` 프로필 수정                                          |
| `/{teamId}/users/me/image`                                      | POST   | `/mypage` 프로필 이미지 업로드                                     |
| `/{teamId}/dashboards`                                          | GET    | `/mydashboard` 내 대시보드 목록, 사이드바 대시보드 목록                    |
| `/{teamId}/dashboards`                                          | POST   | 대시보드 생성 모달                                                |
| `/{teamId}/dashboards/{dashboardId}`                            | GET    | `/dashboard/:dashboardId`, `/dashboard/:dashboardId/edit` |
| `/{teamId}/dashboards/{dashboardId}`                            | PUT    | `/dashboard/:dashboardId/edit`                            |
| `/{teamId}/dashboards/{dashboardId}`                            | DELETE | 대시보드 삭제 필요 시 확장                                           |
| `/{teamId}/dashboards/{dashboardId}/invitations`                | POST   | 초대하기 모달                                                   |
| `/{teamId}/dashboards/{dashboardId}/invitations`                | GET    | `/dashboard/:dashboardId/edit` 초대 내역 목록                   |
| `/{teamId}/dashboards/{dashboardId}/invitations/{invitationId}` | DELETE | `/dashboard/:dashboardId/edit` 초대 취소                      |
| `/{teamId}/invitations`                                         | GET    | `/mydashboard` 초대받은 대시보드 목록                               |
| `/{teamId}/invitations/{invitationId}`                          | PUT    | `/mydashboard` 초대 수락 / 거절                                 |
| `/{teamId}/members`                                             | GET    | 대시보드 멤버 목록, 헤더 아바타                                        |
| `/{teamId}/members/{memberId}`                                  | DELETE | `/dashboard/:dashboardId/edit` 멤버 삭제                      |
| `/{teamId}/columns`                                             | GET    | `/dashboard/:dashboardId` 컬럼 목록                           |
| `/{teamId}/columns`                                             | POST   | 컬럼 생성 모달                                                  |
| `/{teamId}/columns/{columnId}`                                  | PUT    | 컬럼 수정 모달                                                  |
| `/{teamId}/columns/{columnId}`                                  | DELETE | 컬럼 삭제                                                     |
| `/{teamId}/columns/{columnId}/card-image`                       | POST   | 카드 생성 / 수정 모달 이미지 업로드                                     |
| `/{teamId}/cards`                                               | GET    | 대시보드 카드 목록 / 컬럼별 무한 스크롤                                   |
| `/{teamId}/cards`                                               | POST   | 카드 생성                                                     |
| `/{teamId}/cards/{cardId}`                                      | GET    | 카드 상세 모달                                                  |
| `/{teamId}/cards/{cardId}`                                      | PUT    | 카드 수정, 컬럼 간 이동                                            |
| `/{teamId}/cards/{cardId}`                                      | DELETE | 카드 삭제                                                     |
| `/{teamId}/comments`                                            | GET    | 카드 상세 모달 댓글 목록                                            |
| `/{teamId}/comments`                                            | POST   | 카드 상세 모달 댓글 생성                                            |
| `/{teamId}/comments/{commentId}`                                | PUT    | 카드 상세 모달 댓글 수정                                            |
| `/{teamId}/comments/{commentId}`                                | DELETE | 카드 상세 모달 댓글 삭제                                            |


## 4. 디자인 토큰 확인 결과

### 현재 코드에 반영 가능한 확정 토큰

문서에서 바로 확인 가능한 값만 우선 반영합니다.

- Primary Color
  - `primary_100: #E7F1F1`
  - `primary_500: #3CC7C6`
  - `primary_600: #37B5B4`
  - `primary_700: #2B8D8D`
- Breakpoint
  - `sm: 40rem`
  - `md: 48rem`
  - `lg: 64rem`
  - `xl: 80rem`
  - `2xl: 96rem`

### 확인이 필요한 항목

- gray scale
- semantic color
- typography scale
- spacing
- radius
- shadow
- font family

### 참고

- 제공된 Figma 링크를 터미널 환경에서 직접 열어 확인하려 했으나, 현재 환경에서는 **CloudFront 403 차단**으로 내용을 읽을 수 없었습니다.
- 따라서 이번 단계에서는 문서 기반으로만 확정 가능한 토큰만 코드에 반영했습니다.
- 이후 리뷰 시 Figma 기준값을 사람이 확인해 보완하는 흐름이 필요합니다.

