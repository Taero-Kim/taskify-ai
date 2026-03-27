# 폴더 구조는 FSD 방식을 적용할 것

```
src/
├── app/                         # 앱 설정
│   ├── routes/                  # 라우터
│   ├── App.tsx
│		└── styles/                     # 스타일
│		    ├── globals.css
│		    └── colors.ts
│
├── pages/                       # 페이지 (조립만 하기)
│   ├── main/
│   │   └── index.tsx
│   │
│   ├── login/
│   │   ├── index.tsx
│   │   ├── login.types.ts
│   │   ├── login.constants.ts
│   │   ├── components/
│   │   └── hooks/
│   │
│   ├── signup/
│   │   ├── index.tsx
│   │   ├── components/
│   │   └── hooks/
│   │
│   ├── mydashboard/
│   │   └── index.tsx
│   │
│   ├── dashboard/
│   │   ├── index.tsx
│   │   ├── components/
│   │   └── hooks/
│   │
│   └── mypage/
│       └── index.tsx
│
├── features/                    # 기능(이해가 가지 않으면 api별이라고 생각해도 됨)
│   ├── auth/
│   │   ├── apis/
│		│   │   ├── login.ts
│   │   ├── components/
│ 	│   │   └── auth-form/
│		│ 	│       └── index.tsx
│   │   ├── hooks/
│   │   └── contexts/
│   │
│   ├── user/
│   │   ├── apis/
│   │   ├── components/
│   │   └── hooks/
│   │
│   ├── dashboard/
│   │   ├── apis/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── contexts/
│   │
│   ├── column/
│   │   ├── apis/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── contexts/
│   │
│   ├── card/
│   │   ├── apis/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── contexts/
│   │
│   ├── comment/
│   │   ├── apis/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── contexts/
│
├── shared/                     # 공통 (2가지 이상 도메인에 참조되는 공통 컴포넌트만)
│   ├── components/
│   │   ├── button/
│   │   ├── input/
│   │   ├── modal/
│   │   └── dropdown/
│		│   ├── header/
│		│   ├── sidebar/
│		│   ├── dashboard-layout/
│		│   └── todo-board/
│   │
│   ├── hooks/
│   │   └── useDebounce.ts
│   │
│   ├── utils/
│   │   ├── validateEmail.ts
│   │   ├── validatePassword.ts
│   │   └── formatDate.ts
│		│		└── cn.ts
│   │
│   ├── api/
│   │   └── fetch.ts
│   │
│   ├── constants/
│   │   └── queryKey.contstants.ts
│   │
│   ├── types/
│   │   └── common.types.ts
│   │
│   ├── assets/                     # 이미지, 아이콘
│		│   ├── images/
│		    └── icons/
│
│
└── main.tsx
```

# 폴더 구성 전략 예시

1. LoginPage 폴더

   → index.tsx

   → index.constants.ts

   → index.types.ts

   → 다른 파일들과 공통으로 사용하는 타입과 상수는 공통 types/constants 폴더에 auth.constants.ts, auth.types.ts
