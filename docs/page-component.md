# 페이지 구성 초안 및 페이지 내 컴포넌트 구성 전략

- 페이지 별로 어떤 컴포넌트가 있는지 파악해보기
- 공통으로 뽑을만한 건 뭐가 있을 지 파악하기

---

### 1. 메인페이지-랜딩(/)

- 헤더
  ![image.png](attachment:27e216ff-2915-41f4-a1da-74fbb5f6b394:image.png)
- 상단 영역
  ![image.png](attachment:c80b80a2-74d3-4a73-bdbb-b36a3a4b440d:image.png)
- 소개 카드
  ![image.png](attachment:6a4c7e06-88e3-4af0-b2dc-1f00b57484f6:image.png)
- 하단 소개
  ![image.png](attachment:09f1c455-3f28-4bf5-b5c6-963aacffb530:image.png)
- 푸터
  ![image.png](attachment:327c509b-bc1c-4b6d-af15-c1c7b028645b:image.png)

### 2. 로그인 페이지(/login) 3. 회원가입(/signup)

- 로고
  ![image.png](attachment:d17c3728-a965-4032-8be6-050e0b780a0e:image.png)
- 로고 + 텍스트(상단 영역)
  ![image.png](attachment:f31814d3-ea6b-4f70-b5aa-fdf961fc830a:image.png)
- 전체 form 컴포넌트
  ![image.png](attachment:ff5fef6e-a7da-4ad6-9906-18b5ac94231c:image.png)
- 인풋 + 라벨
  ![image.png](attachment:6783ae91-5635-4869-97e7-6e9c50f2e0ee:image.png)
- 버튼
  ![image.png](attachment:a9ff47fc-a13d-40fe-8945-3c9653518bba:image.png)
- 하단 영역
  ![image.png](attachment:08733236-98a5-4499-bd22-f6d8eb51ff38:image.png)
- 모달
  ![image.png](attachment:6ed2081a-d021-4051-a21b-8862dc2d4ee3:image.png)

### 4. 내 대쉬보드(/mydashboard)

- 헤더
  ![image.png](attachment:7c4275f9-eb91-4475-bfce-fa0b67fd6ea3:image.png)
- 사이드바
  ![image.png](attachment:9a868e51-c3a9-4887-b8ee-194ea5bbaf83:image.png)
- 버튼
  ![image.png](attachment:31665acf-5960-4374-bd0f-a7f32ce93691:image.png)
- 네비게이션 버튼
  ![image.png](attachment:02a8f9e5-cbec-44fb-bba0-50dbf5fdf302:image.png)
- 검색바
  ![image.png](attachment:f44ce180-eb97-4595-9f91-3573626f5199:image.png)
- 대쉬보드 리스트
  ![image.png](attachment:e9debb71-b864-4966-9378-c40d2c8606bf:image.png)
- 초대내역
  ![image.png](attachment:02164abd-5087-448d-9f40-33c865cb856c:image.png)

### 5. 대쉬보드 상세 페이지(/dashboard/{dashboardid})

- 헤더
  ![image.png](attachment:16e2c2d3-20f5-4acd-b50c-f9bbebc840d7:image.png)
- 사이드바
  ![image.png](attachment:6f3d5fab-dfb9-42e9-9bd6-355098a990a2:image.png)
- 칼럼 레이아웃
  ![image.png](attachment:dfff84a7-c2a0-4891-839c-83a214b6c7cd:image.png)
- 칼럼
  ![image.png](attachment:bb49ecd2-3977-4094-8268-69f2ad3312a4:image.png)
- 모달
  ![image.png](attachment:336d8151-30d5-4b32-8c58-f8be4a83f827:image.png)
  ![image.png](attachment:37c591ee-1c39-4258-bfe7-39130e396f98:image.png)
  ![image.png](attachment:9e8e4e6c-6b1d-44e5-8158-d0dd1d92bc5d:image.png)
  ![image.png](attachment:fb51d71d-42d1-44d3-9fb9-56e78c11aa9d:image.png)
  ![image.png](attachment:3b42de17-2241-44cb-baea-5d5e154e010d:image.png)
- 태그 칩
  ![image.png](attachment:40a52135-e61e-42c9-bc45-2d7662b9cb2b:image.png)
- 상태관리 칩
  ![image.png](attachment:b9db778c-3183-4298-861f-4b4618571dc2:image.png)
- 드롭다운 메뉴
  ![image.png](attachment:7c02f4ff-7619-465e-9554-d7798647c352:image.png)
- 댓글 폼
  ![image.png](attachment:6aa3158e-0e29-4d61-be11-7137c37a9dc9:image.png)
- 댓글 리스트
  ![image.png](attachment:4dc2f846-75c1-40d6-ad46-51ae012af157:image.png)
- 만든 사람 정보?
  ![image.png](attachment:39b3b382-46c3-4a70-8dd2-9fb4613afb41:image.png)
- 버튼
  ![image.png](attachment:d1874a51-5c8d-4cdf-9e8f-5ec3970bed66:image.png)
  ![image.png](attachment:bd41d2be-7158-42f1-aa90-5b2b47c522d4:image.png)
  ![image.png](attachment:5f7cfa7a-cb15-414a-ae72-3e0001c66c97:image.png)
  ![image.png](attachment:53c58eed-6238-4edd-9e37-032bed548f57:image.png)
  ![image.png](attachment:fde0b589-87fb-404d-aa6c-634ed3ba36a4:image.png)
  ![image.png](attachment:f7979de2-76f7-4bb3-b83c-8f7cdea6ba32:image.png)
- 모달 내 폼
  ![image.png](attachment:2906b7a1-0b0b-4108-a336-3dde995e1b70:image.png)

### 6. 대쉬보드 수정(/dashboard/{dashboardid}/edit)

- 헤더
  ![image.png](attachment:2d18b73e-48fc-42f6-b839-3a835946adda:image.png)
- 사이드바
  ![image.png](attachment:2761d20d-6610-437f-9707-fc306a65361a:image.png)
- 인풋+라벨
  ![image.png](attachment:0eeadbfc-dd83-4e62-af1b-664d066451c4:image.png)
- 버튼
  ![image.png](attachment:649abe12-bbe8-425b-823e-ef9185e8e661:image.png)
  ![image.png](attachment:96bb1b21-581f-4853-ac54-9ecfda176eec:image.png)
- 구성원, 이메일 목록(리스트)
  ![image.png](attachment:7bf76ff4-0b87-4241-841d-d4162a01e7e6:image.png)
  ![image.png](attachment:0295b3f1-8c3b-48ab-9c73-d7855f5116a2:image.png)
- 네비게이션
  ![image.png](attachment:d828c31e-f08d-4c97-ae77-ca14bd753714:image.png)
- 모달
  ![image.png](attachment:d5ab889b-c7e5-44eb-bbcd-7f0cd12877ff:image.png)

### 7. 마이 페이지(/mypage)

- 헤더
  ![스크린샷 2026-03-19 오후 12.09.09.png](attachment:17cff285-3a80-4124-b36f-4b9ba109006e:스크린샷_2026-03-19_오후_12.09.09.png)
- 프로필 카드
  ![image.png](attachment:e851a86e-66b9-4922-a959-1ac427b6e46d:image.png)
- 인풋 + 라벨
  ![스크린샷 2026-03-19 오후 12.07.15.png](attachment:d2f96418-4d09-4b1a-b695-5457d0aae4b2:스크린샷_2026-03-19_오후_12.07.15.png)
  ![스크린샷 2026-03-19 오후 12.04.38.png](attachment:9c377c51-e2e1-4175-8611-cbf707ceee55:스크린샷_2026-03-19_오후_12.04.38.png)
- 버튼
  ![스크린샷 2026-03-19 오후 12.02.45.png](attachment:32121918-2178-4f43-a833-e822a2e2bed1:스크린샷_2026-03-19_오후_12.02.45.png)
  ![스크린샷 2026-03-19 오후 12.06.00.png](attachment:22392f76-84ac-47d1-9395-708b1faa45a2:스크린샷_2026-03-19_오후_12.06.00.png)
- 사이드바
  ![스크린샷 2026-03-19 오후 12.18.39.png](attachment:47f16dc4-2646-45b4-9459-81e30de564e3:스크린샷_2026-03-19_오후_12.18.39.png)
- 모달
  ![스크린샷 2026-03-19 오후 12.23.26.png](attachment:2e50d330-0dd4-4ad8-a749-64167536f206:스크린샷_2026-03-19_오후_12.23.26.png)

### 공통 컴포넌트

- 타이틀
  h2~h6까지 선택 가능하게
  폰트 사이즈 및 굵기 결정할 수 있게
- 로고
  Large, Medium, Small prop으로 선택 가능하게, 그리고 Link를 /로 하게
- avatar(프로필)
  ![image.png](attachment:35df23f9-aa4b-4a2e-a000-37976f38b93d:image.png)
  ![image.png](attachment:0a0a3c9d-dc1f-4268-86cd-f86ffb13f86f:image.png)
  ![image.png](attachment:5121ebea-6f78-4a00-8aa4-61fbcbc5eee9:image.png)
- 헤더
  ![image.png](attachment:2d18b73e-48fc-42f6-b839-3a835946adda:image.png)
- 사이드바
  ![image.png](attachment:b085be0c-2a95-4570-888c-3fbce3323d48:image.png)
- 모달
  - 모달 프레임
  - 모달 바디
  - 모달 푸터
  - 모달 폼
  - 모달 타이틀
  - 모달 포탈
    ![image.png](attachment:b336231d-94fc-4d7b-ba4d-c40e5c0cd3e9:image.png)
    ![image.png](attachment:9b157526-74bd-460e-a9bb-8eee810f7f37:image.png)
- 버튼
  ![image.png](attachment:b83054df-f9c4-4f9b-80b5-7b7b4f2e9974:image.png)
  ![image.png](attachment:812f5849-f860-49a6-9dc4-695170c688f9:image.png)
  ![image.png](attachment:9a3d063b-66a7-46d3-a4c2-6a917d391976:image.png)
  ![image.png](attachment:961f86c6-7970-4ea7-9eb2-3d252abc7a2e:image.png)
- 인풋+라벨
  - TextArea는 별도로
    ![image.png](attachment:8c6f4f7f-b57e-4f5b-98fd-68022280bf00:image.png)
    ![image.png](attachment:6a846978-5148-405d-9ecc-8ea7d5a878a0:image.png)
    ![image.png](attachment:8243865b-472a-4214-8d3b-bf421d3b29d6:image.png)
- 대시보드 / 컬럼버튼?
  ![image.png](attachment:1eea5a76-b2ea-437e-933d-8284140b9a5c:image.png)
  ![image.png](attachment:521b1934-e5c0-434b-88f2-a5f9624fcfb5:image.png)
- 이미지 추가 버튼
  ![image.png](attachment:f83f3587-f16d-43b6-88fc-7664d64c821a:image.png)
- 네비게이션 버튼
  ![image.png](attachment:10a52c41-2ceb-4590-b7d7-753950cab1c9:image.png)
  ![image.png](attachment:7901d6b1-0457-43eb-8390-b33e1fb16473:image.png)
- 원+대시보드 이름만 묶는걸로
  ![사이드바](attachment:b09e1abd-b6aa-4364-ab79-629c3c54b809:image.png)
  사이드바
  ![대시보드 리스트](attachment:4948001d-95e5-4af4-975d-29fd2fcb3879:image.png)
  대시보드 리스트
- 컬러 칩셋
  ![생성 / 수정](attachment:283eb7bd-9b35-4127-ae05-4c7c94a9c66b:image.png)
  생성 / 수정
- 이미지 업로드(마이페이지 프로필과 모달에서 사용)
  ![스크린샷 2026-03-19 오후 12.30.37.png](attachment:d9ad1dcc-0812-4eed-8325-1866e987a58f:스크린샷_2026-03-19_오후_12.30.37.png)
