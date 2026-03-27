## 프레임워크

### React +Typescript

- 선택 이유:

프로젝트 난이도가 높은 만큼 새로운 기술을 동시에 도입하기보다는,
기초 프로젝트에서 사용했던 React를 기반으로 이해도를 더욱 심화하는 방향을 선택했습니다.

또한 TypeScript는 실무 활용도가 높은 기술로,
이번 프로젝트를 통해 타입 기반 개발 방식에 익숙해지고 이를 실제 코드에 적용해보고자 도입했습니다.

## CSS

### Tailwind

- `clsx`, `tw-merge`, `cva`
- https://dev-102.tistory.com/entry/Tailwind-CSS-%EC%9E%98-%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B0-with-Clxs-CVA-twMerge
- https://daunje0.tistory.com/306
  → 유틸함수로 만들어서 사용해야 함
- 선택 이유:

Tailwind는 실무에서 많이 사용되는 CSS 프레임워크이기 때문에,
프로젝트를 통해 자연스럽게 익히고 빠른 UI 개발 경험을 쌓고자 선택했습니다.

## API

### fetch

- 선택 이유:

추후 사용 예정인 Next.js 환경에서는 fetch 기반 데이터 패칭이 권장되며,
fetch의 동작 원리를 이해하면 axios와 같은 라이브러리도 보다 수월하게 활용할 수 있을 것으로 판단하여 선택했습니다.

1. 나중에 next.js를 사용할때 fetch가 궁합이 더 좋다고 해서 연습겸
2. 원래 어려운거 먼저 해야 기초가 탄탄해지면서 나중에 axios 쓸때 더 easy 하니까

### context API

## 배포

- vercel

## 포맷팅

- eslint
- prettier
- husky

### 라이브러리

- react-router
- svgr

**달력 관련**

- react-datepicker (^7.5.0)
- date-fns (^4.1.0)
- 🔍 패키지 선택 과정 및 이유
  1. react-datepicker 설치 이유
  - 기존 프로젝트에서 사용 중인 달력 컴포넌트로, 동일한 UI를 유지하기 위해 react-datepicker를 선택했습니다.
  - 이 패키지를 사용하면 UI 통일성을 확보할 수 있고, 추가적인 학습 부담 없이 바로 적용할 수 있습니다.
  1. date-fns 설치 이유
  - 날짜와 시간을 처리하기 위한 유틸리티로 date-fns를 선택했습니다. dayjs나 moment와 비교했을 때, 다음과 같은 장점이 있어 date-fns를 우선 고려하게 되었습니다:
  - 유용한 기능: isBefore, startOfDay 등 유용한 기능들이 많습니다.
  - 타입스크립트 지원: date-fns는 TypeScript와 잘 호환되어 타입 안전성을 높일 수 있습니다
