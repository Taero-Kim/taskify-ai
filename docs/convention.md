## 커밋 컨벤션

예시) 🔧 Chore: eslint&prettier 설정 추가

```jsx
'🎉 Init', // 프로젝트 생성 (최초 1회)
'✨ Feat', // 새로운 기능/페이지 추가
'🐛 Fix', // 버그 수정
'♻️ Refactor', // 코드 리팩토링
'🔧 Chore', // 설정, 빌드, 패키지 설치, 아이콘, 이미지 파일 추가
'🎨 Style', // 스타일/포맷팅 변경
'📝 Docs', // 문서 관련 수정
'🚚 Rename', // 파일/디렉토리명 변경, 파일 이동
'🔥 Remove', // 코드/파일 삭제
'🔀 Merge', //머지될 경우
```

### **Commit Body Rule**

> 제목과 본문을 빈 행으로 분리<br>
> 입력본문은 한 줄 최대 72자 입력<br>
> 본문을 사용하여 변경 한 내용과 이유 설명(어떻게 보다는 무엇과 왜를 설명)<br>
> 한글로 작성<br>

## 이름 규칙

### 디렉토리명

| **폴더명** | `kebab-case` | user-profile |
| ---------- | ------------ | ------------ |

### 파일명(컴포넌트, 페이지 → tsx, 나머지는 js)

| **대상**                   | **규칙**                  | **예시**                                 |
| -------------------------- | ------------------------- | ---------------------------------------- |
| **일반 JS파일**            | `camelCase`               | `formatDate.js`, `apiService.js`         |
| **assets(아이콘, 이미지)** | `kebab-case`              | `ic-arrow-left.svg`, `img-main-logo.png` |
| **상수 파일**              | `PascalCase.constants.js` | `UserProfile.constants.js`               |

- 숫자는 01, 02, 03처럼 두 자리로 통일
- 용량이 클 경우 경량화

```markdown
SVG : 아이콘 / 로고 / 단순한 일러스트
PNG : 투명 이미지 / UI 요소 / SVG로 하기 애매한 아이콘
```

### 아이콘 에셋 파일

IcArrow, ImgBack

index.js → import {아이콘 나열} from index.js

### 함수

- 페이지 및 컴포넌트 함수는 PascalCase
  - 페이지는 Page라고 붙이기
  - 예시) MainPage, DashboardPage, MyDashBoardPage
- 함수 표현식
- 변수 / 함수 : camelCase
- 이벤트 핸들러 : handle + 동사 ( prop으로 내릴 땐 on + 동사 )
  - 예시 : handleClick ( onClick ), handleLoad ( onLoad )
- 불리언(Boolean) 변수
  - 질문 형태의 접두사를 붙여 직관적으로 표현합니다.
    - `is + 명사/형용사`: `isLoading`, `isModalOpen`
    - `has + 명사`: `hasToken`, `hasError`

### 상수

- **상수(Constant):** 전체 `UPPER_SNAKE_CASE`를 사용합니다.
  - 예: `API_BASE_URL`, `MAX_COUNT`

### **파일 `import`시 절대경로 별칭 사용**

```jsx
//import Button from '../../common/Button';
import Button from '@/components/common/Button'
```

### 주석

- TSDoc 활용하기
  - 컴포넌트 단위에서 활용하기 → TSDoc 위치 주의할 것
  - 간단하게 컴포넌트 설명 + 예시 작성하기
  - `@params`는 타입스크립트를 사용하기 때문에 사용하지 않는 걸로 결정!
- https://tsdoc.org/

````jsx
/**
 * Task 항목을 표시하는 카드 컴포넌트입니다.(컴포넌트 설명)
 *
 * 제목과 상태를 보여주며, 클릭 시 상세 페이지로 이동할 수 있습니다.
 *
 * @example
 * ```tsx
 * <TaskCard
 *   title="프로젝트 구조 잡기"
 *   status="DONE"
 *   onClick={() => navigate(`/task/1`)}
 * />
 * ```
 */
export const TaskCard = ({ title, status, onClick }: Props) => {
  return (
    <div onClick={onClick}>
      <h3>{title}</h3>
      <span>{status}</span>
    </div>
  );
};
````

- TODO 주석 활용하기 → 급하게 PR을 올려야 하거나, 아직 구현을 못 할때

```jsx
// TODO: 나중에 이거 해야함
```

## 브레이크 포인트

| **Breakpoint prefix** | **Minimum width**    | **CSS**                               | Device           |
| --------------------- | -------------------- | ------------------------------------- | ---------------- |
| **`sm`**              | 40rem *(640px)*      | **`@media (width >= 40rem) { ... }`** | ( 필요 시 사용 ) |
| **`md`**              | **48rem *(768px)***  | **`@media (width >= 48rem) { ... }`** | **태블릿**       |
| **`lg`**              | **64rem *(1024px)*** | **`@media (width >= 64rem) { ... }`** | **데스크탑**     |
| **`xl`**              | 80rem *(1280px)*     | **`@media (width >= 80rem) { ... }`** | ( 필요 시 사용 ) |
| **`2xl`**             | 96rem *(1536px)*     | **`@media (width >= 96rem) { ... }`** | ( 필요 시 사용 ) |

※ 모바일 퍼스트뷰

## Props/Type

→ ComponentProps 방식으로 결정

→ 2번 전부 Type으로 결정, interface는 사용 X
