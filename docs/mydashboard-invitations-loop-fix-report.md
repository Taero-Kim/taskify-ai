# MyDashboard invitations 무한 호출 수정 보고

## 1. 문제 현상

- `/mydashboard` 진입 직후 `/{teamId}/invitations` API가 반복적으로 호출됨
- 결과적으로 초대 목록이 계속 reset/reload 되면서 네트워크 요청이 무한 증가함

## 2. 정확한 원인

원인은 **초기 초대 목록 로딩 effect와 `fetchInvitations` callback의 의존성 구조**였습니다.

문제 코드 구조:

- `useEffect(() => { fetchInvitations({ reset: true }) }, [fetchInvitations])`
- `fetchInvitations`는 `useCallback(..., [hasMoreInvitations, isFetchingMoreInvitations, nextInvitationCursorId, openToast])`

즉,

1. `fetchInvitations` 내부에서
   - `hasMoreInvitations`
   - `isFetchingMoreInvitations`
   - `nextInvitationCursorId`
     state를 변경함
2. 이 state 변경 때문에 `fetchInvitations` 함수 참조가 매번 새로 생성됨
3. `useEffect`가 `[fetchInvitations]` 의존성으로 다시 실행됨
4. 다시 `fetchInvitations({ reset: true })`가 호출됨
5. 같은 흐름이 반복되며 `/invitations` 요청이 무한 호출됨

핵심적으로는,
**요청 함수가 자기 자신이 바꾸는 state에 의존하고 있었기 때문에 effect가 재실행 루프에 들어간 것**입니다.

## 3. 해결 방법

초대 목록 요청에 필요한 가변값을 state 의존성 대신 `ref`로 분리했습니다.

적용한 변경:

- `invitationCursorRef`
- `hasMoreInvitationsRef`
- `isFetchingMoreInvitationsRef`

변경 후 구조:

- `fetchInvitations`는 `openToast`만 의존하도록 안정화
- cursor / hasMore / fetching 여부는 ref로 읽고 갱신
- 초기 로딩 effect는 더 이상 state 변화 때문에 다시 실행되지 않음

## 4. 결과

수정 결과:

- `/mydashboard` 진입 시 초기 `/invitations` 요청은 1회만 수행됨
- 무한 호출 루프 제거
- 무한 스크롤은 그대로 유지
- 초대 수락/거절 후 reset 재조회도 정상 동작 유지

## 5. 검증

- `npm run lint` 통과
- `npm run build` 통과

## 6. 수정 파일

- `src/pages/mydashboard/index.tsx`
- `docs/mydashboard-invitations-loop-fix-report.md`
