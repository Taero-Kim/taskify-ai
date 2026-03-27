# 📄 Taskify 메인 랜딩 페이지 구조 (Markdown)

## 1. 전체 레이아웃

```md
Layout
├── Header (네비게이션)
├── Hero Section (메인 소개)
├── Feature Section 1 (우선순위 기능)
├── Feature Section 2 (할 일 추가 기능)
├── Footer (현재는 없음 or 생략)
```

---

## 2. Header (상단 네비게이션)

```md
Header
├── Logo (Taskify)
├── Navigation (우측)
│ ├── 로그인
│ └── 회원가입
```

👉 특징

- 매우 심플한 SaaS 스타일
- CTA는 Hero에 집중시키고, Header는 최소화

---

## 3. Hero Section (메인 랜딩 영역)

```md
Hero Section
├── Tagline
│ └── "Simplify Your Tasks"
├── Main Branding
│ ├── Logo Icon
│ └── Taskify 텍스트
├── Subtitle
│ └── "작업을 더 쉽고 단순하게"
├── CTA Buttons
│ ├── Primary: "지금 시작하기"
│ └── Secondary: "주요 기능 보기"
├── Illustration
│ └── 협업하는 사람들 일러스트
```

👉 핵심 역할

- 서비스 정체성 전달
- CTA 클릭 유도
- 감성 + 직관 UX

👉 개발 팁

- `flex-col + center align`
- 버튼 2개 → Primary / Secondary 스타일 분리

---

## 4. Feature Section 1 (Prioritize)

```md
Feature Section: Prioritize
├── Section Label
│ └── "PRIORITIZE"
├── Title
│ └── "일의 우선순위를 한눈에 정리하세요"
├── Content Layout (2 Column)
│ ├── Left
│ │ └── 텍스트
│ └── Right
│ └── Kanban Board UI 이미지
```

👉 특징

- 좌: 설명 / 우: 실제 UI
- 제품 기능 설명 핵심 섹션

👉 개발 구조

```jsx
<section>
  <TextBlock />
  <ImagePreview />
</section>
```

---

## 5. Feature Section 2 (Add Tasks)

```md
Feature Section: Add Tasks
├── Section Label
│ └── "ADD TASKS"
├── Title
│ └── "할 일을 간단하게 추가하세요"
├── Content Layout (2 Column)
│ ├── Left
│ │ └── Task 생성 Form UI
│ └── Right
│ └── 텍스트 설명
```

👉 특징

- Section 1과 반대 레이아웃 (좌우 반전)
- 시각적인 리듬 형성

---

## 6. 공통 UI 패턴 정리

```md
공통 패턴

1. Section 구조
   ├── Label (소제목)
   ├── Title (큰 제목)
   └── Content (이미지 + 설명)

2. Layout
   ├── 2 Column Grid
   └── Alternating Layout (좌우 반전)

3. CTA
   ├── Primary (강조 버튼)
   └── Secondary (보조 버튼)

4. Tone
   ├── 미니멀
   ├── 파스텔톤 (민트 계열)
   └── 일러스트 기반 친근한 UI
```

---

## 7. 컴포넌트 단위 설계 (개발용)

```md
components/
├── Header
├── HeroSection
├── FeatureSection
│ ├── FeatureText
│ ├── FeatureImage
│ └── FeatureLayout (left/right toggle)
├── CTAButton
└── Container
```

---
