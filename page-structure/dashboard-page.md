# 📄 Taskify 대시보드 페이지 구조 (Markdown)

## 1. 전체 레이아웃

```md
Dashboard Layout
├── Header (상단 바)
├── Main Layout
│ ├── Sidebar (좌측 대시보드 목록)
│ └── Board Area (칸반 보드)
```

👉 핵심 구조

- **좌측: 네비게이션 (Dashboard 선택)**
- **우측: 실제 작업 공간 (Kanban Board)**

---

## 2. Header (상단 영역)

```md
Header
├── Left
│ ├── Logo (Taskify)
│ └── 현재 대시보드 이름 (예: 비브리지)
│
├── Right
│ ├── 관리 버튼 (⚙️ 관리)
│ ├── 초대하기 버튼 (+ 초대하기)
│ ├── 멤버 아바타 리스트
│ │ ├── Y
│ │ ├── C
│ │ ├── K
│ │ └── +2
│ └── 사용자 프로필 (배유철)
```

👉 특징

- 협업 툴 느낌 (Notion / Jira 스타일)
- **멤버 상태 + 협업 기능 강조**

---

## 3. Sidebar (좌측 영역)

```md
Sidebar
├── Section Title
│ └── Dash Boards
│
├── Dashboard List
│ ├── 비브리지 (현재 선택됨)
│ ├── 코드잇
│ ├── 3분기 계획
│ ├── 회의록
│ └── 중요 문서함
│
└── Add Dashboard Button (+)
```

👉 특징

- 다중 프로젝트 / 보드 관리 구조
- 선택된 대시보드는 highlight 처리

---

## 4. Board Area (칸반 보드)

```md
Board Area
├── Column List (Horizontal Scroll)
│ ├── Column: To Do
│ ├── Column: On Progress
│ ├── Column: Done
│ └── Column: 새로운 컬럼 추가하기
```

👉 핵심 UX

- **수평 스크롤 구조**
- Trello / Jira 스타일

---

## 5. Column 구조

```md
Column
├── Column Header
│ ├── Status Name (예: To Do)
│ ├── Task Count (숫자)
│ └── Settings Icon (⚙️)
│
├── Add Task Button (+)
│
└── Task List
├── Task Card
├── Task Card
└── ...
```

---

## 6. Task Card 구조 (핵심)

```md
Task Card
├── Thumbnail (선택)
│ └── 이미지 (있을 경우)
│
├── Title
│ └── "새로운 일정 관리 Taskify"
│
├── Tags
│ ├── 프로젝트
│ ├── 백엔드
│ └── 상
│
├── Due Date
│ └── 📅 2022.12.31
│
└── Assignee
└── Avatar (예: B)
```

👉 특징

- **정보 밀도 높음**
- 카드 하나로 상태 파악 가능

---

## 7. Column 추가 영역

```md
Add Column
└── "새로운 컬럼 추가하기" 버튼
```

👉 기능

- 동적 Kanban 구조 지원

---

## 8. 전체 데이터 구조 (개발 관점)

```ts
Dashboard
{
  id
  name
  members[]
  columns[]
}

Column
{
  id
  title
  order
  tasks[]
}

Task
{
  id
  title
  description
  tags[]
  dueDate
  assignee
  image
}
```

---

## 9. 컴포넌트 구조 (React 기준)

```md
components/
├── Header
├── Sidebar
├── Board
│ ├── Column
│ │ ├── ColumnHeader
│ │ ├── TaskCard
│ │ └── AddTaskButton
│ └── AddColumn
```

---

## 10. UX 흐름 (진짜 중요)

```md
User Flow

1. Sidebar에서 Dashboard 선택
2. Board에서 상태별 Task 확인
3. Task 추가 (+ 버튼)
4. 상태 변경 (Drag & Drop 예상)
5. 협업 (멤버, 초대)
```

---

## 🔥 핵심 한 줄 정리

👉 **"좌측은 프로젝트, 우측은 상태 기반 작업 관리 (Kanban)"**
