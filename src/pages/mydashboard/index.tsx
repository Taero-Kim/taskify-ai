import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { Link } from 'react-router-dom'

import { ROUTE_PATH } from '@/app/routes/route-path'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { CreateDashboardModalContent } from '@/features/dashboard/components/create-dashboard-modal-content'
import type { Dashboard, Invitation } from '@/features/dashboard/apis/dashboard.types'
import { getDashboards } from '@/features/dashboard/apis/getDashboards'
import { getInvitations } from '@/features/dashboard/apis/getInvitations'
import { updateInvitation } from '@/features/dashboard/apis/updateInvitation'
import { ApiError } from '@/shared/api/fetch'
import { Button } from '@/shared/components/button'
import { DashboardLayout } from '@/shared/components/dashboard-layout'
import { DashboardHeader } from '@/shared/components/header'
import { Input } from '@/shared/components/input'
import { useModal } from '@/shared/components/modal/useModal'
import { DashboardSidebar } from '@/shared/components/sidebar'
import { useToast } from '@/shared/components/toast/useToast'
import {
  DASHBOARD_LIST_PAGE_SIZE,
  INVITATION_PAGE_SIZE,
  SIDEBAR_DASHBOARD_PAGE_SIZE,
} from '@/shared/constants/dashboard'

const createDashboardPath = (dashboardId: number) =>
  ROUTE_PATH.dashboard.replace(':dashboardId', String(dashboardId))

type DashboardState = {
  dashboards: Dashboard[]
  isLoading: boolean
  totalCount: number
}

const INITIAL_DASHBOARD_STATE: DashboardState = {
  dashboards: [],
  isLoading: true,
  totalCount: 0,
}

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}

const DashboardCard = ({ dashboard }: { dashboard: Dashboard }) => {
  return (
    <Link
      className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-taskify-primary-400 hover:shadow-md"
      to={createDashboardPath(dashboard.id)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex size-4 rounded-full"
            style={{ backgroundColor: dashboard.color }}
          />
          <h3 className="text-lg font-semibold text-slate-900">{dashboard.title}</h3>
        </div>
        {dashboard.createdByMe ? <span aria-hidden="true">👑</span> : null}
      </div>
      <div className="flex items-center justify-between gap-4 text-sm text-slate-500">
        <span>대시보드 ID #{dashboard.id}</span>
        <span>{new Date(dashboard.updatedAt).toLocaleDateString('ko-KR')}</span>
      </div>
    </Link>
  )
}

const InvitationCard = ({
  invitation,
  isProcessing,
  onAccept,
  onReject,
}: {
  invitation: Invitation
  isProcessing: boolean
  onAccept: (invitationId: number) => void
  onReject: (invitationId: number) => void
}) => {
  return (
    <article className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-slate-900">{invitation.dashboard.title}</h3>
        <p className="text-sm text-slate-500">
          초대한 사람: {invitation.inviter.nickname} ({invitation.inviter.email})
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button disabled={isProcessing} onClick={() => onAccept(invitation.id)} size="sm">
          {isProcessing ? '처리 중...' : '수락'}
        </Button>
        <Button
          disabled={isProcessing}
          onClick={() => onReject(invitation.id)}
          size="sm"
          variant="outline"
        >
          거절
        </Button>
      </div>
    </article>
  )
}

export const MyDashboardPage = () => {
  const { user } = useAuth()
  const { openModal } = useModal()
  const { openToast } = useToast()
  const invitationObserverRef = useRef<HTMLDivElement | null>(null)
  const invitationCursorRef = useRef<number | undefined>(undefined)
  const hasMoreInvitationsRef = useRef(true)
  const isFetchingMoreInvitationsRef = useRef(false)
  const [dashboardPage, setDashboardPage] = useState(1)
  const [sidebarPage, setSidebarPage] = useState(1)
  const [dashboardState, setDashboardState] = useState(INITIAL_DASHBOARD_STATE)
  const [sidebarDashboardState, setSidebarDashboardState] = useState(INITIAL_DASHBOARD_STATE)
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isInitialInvitationLoading, setIsInitialInvitationLoading] = useState(true)
  const [isFetchingMoreInvitations, setIsFetchingMoreInvitations] = useState(false)
  const [hasMoreInvitations, setHasMoreInvitations] = useState(true)
  const [processingInvitationId, setProcessingInvitationId] = useState<number | null>(null)

  const fetchDashboardPage = useCallback(
    async (
      page: number,
      pageSize: number,
      setState: Dispatch<SetStateAction<DashboardState>>,
      fallbackMessage: string,
    ) => {
      setState((prevState) => ({
        ...prevState,
        isLoading: true,
      }))

      try {
        const response = await getDashboards({
          navigationMethod: 'pagination',
          page,
          size: pageSize,
        })

        setState({
          dashboards: response.dashboards,
          isLoading: false,
          totalCount: response.totalCount,
        })
      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }))

        openToast({
          title: getErrorMessage(error, fallbackMessage),
          tone: 'error',
        })
      }
    },
    [openToast],
  )

  const fetchInvitations = useCallback(
    async (options?: { reset?: boolean }) => {
      const shouldReset = options?.reset ?? false

      if (isFetchingMoreInvitationsRef.current) {
        return
      }

      if (!shouldReset && !hasMoreInvitationsRef.current) {
        return
      }

      if (shouldReset) {
        setIsInitialInvitationLoading(true)
        setHasMoreInvitations(true)
        hasMoreInvitationsRef.current = true
        invitationCursorRef.current = undefined
      } else {
        setIsFetchingMoreInvitations(true)
        isFetchingMoreInvitationsRef.current = true
      }

      try {
        const response = await getInvitations({
          cursorId: shouldReset ? undefined : invitationCursorRef.current,
          size: INVITATION_PAGE_SIZE,
        })

        setInvitations((prevInvitations) => {
          const nextInvitations = shouldReset
            ? response.invitations
            : [...prevInvitations, ...response.invitations]

          return nextInvitations.filter(
            (invitation, invitationIndex, invitationArray) =>
              invitationArray.findIndex(({ id }) => id === invitation.id) === invitationIndex,
          )
        })
        invitationCursorRef.current = response.cursorId ?? undefined
        hasMoreInvitationsRef.current = response.cursorId !== null
        setHasMoreInvitations(hasMoreInvitationsRef.current)
      } catch (error) {
        openToast({
          title: getErrorMessage(error, '초대 목록을 불러오지 못했습니다.'),
          tone: 'error',
        })
      } finally {
        setIsInitialInvitationLoading(false)
        setIsFetchingMoreInvitations(false)
        isFetchingMoreInvitationsRef.current = false
      }
    },
    [openToast],
  )

  useEffect(() => {
    void fetchDashboardPage(
      dashboardPage,
      DASHBOARD_LIST_PAGE_SIZE,
      setDashboardState,
      '대시보드 목록을 불러오지 못했습니다.',
    )
  }, [dashboardPage, fetchDashboardPage])

  useEffect(() => {
    void fetchDashboardPage(
      sidebarPage,
      SIDEBAR_DASHBOARD_PAGE_SIZE,
      setSidebarDashboardState,
      '사이드바 대시보드를 불러오지 못했습니다.',
    )
  }, [fetchDashboardPage, sidebarPage])

  useEffect(() => {
    void fetchInvitations({ reset: true })
  }, [fetchInvitations])

  useEffect(() => {
    if (!invitationObserverRef.current || !hasMoreInvitations) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void fetchInvitations()
        }
      },
      { rootMargin: '200px 0px' },
    )

    observer.observe(invitationObserverRef.current)

    return () => {
      observer.disconnect()
    }
  }, [fetchInvitations, hasMoreInvitations])

  const filteredInvitations = useMemo(() => {
    const normalizedSearchKeyword = searchKeyword.trim().toLowerCase()

    if (!normalizedSearchKeyword) {
      return invitations
    }

    return invitations.filter((invitation) =>
      invitation.dashboard.title.toLowerCase().includes(normalizedSearchKeyword),
    )
  }, [invitations, searchKeyword])

  const dashboardTotalPages = Math.max(
    1,
    Math.ceil(dashboardState.totalCount / DASHBOARD_LIST_PAGE_SIZE) || 1,
  )
  const sidebarTotalPages = Math.max(
    1,
    Math.ceil(sidebarDashboardState.totalCount / SIDEBAR_DASHBOARD_PAGE_SIZE) || 1,
  )

  const openCreateDashboardModal = () => {
    openModal({
      content: <CreateDashboardModalContent />,
      description: '대시보드 이름과 색상을 선택한 뒤 생성할 수 있습니다.',
      title: '새로운 대시보드',
    })
  }

  const handleInvitationDecision = async (invitationId: number, inviteAccepted: boolean) => {
    setProcessingInvitationId(invitationId)

    try {
      await updateInvitation(invitationId, { inviteAccepted })
      openToast({
        title: inviteAccepted ? '초대를 수락했습니다.' : '초대를 거절했습니다.',
        tone: inviteAccepted ? 'success' : 'info',
      })
      await Promise.all([
        fetchDashboardPage(
          dashboardPage,
          DASHBOARD_LIST_PAGE_SIZE,
          setDashboardState,
          '대시보드 목록을 다시 불러오지 못했습니다.',
        ),
        fetchDashboardPage(
          sidebarPage,
          SIDEBAR_DASHBOARD_PAGE_SIZE,
          setSidebarDashboardState,
          '사이드바 대시보드를 다시 불러오지 못했습니다.',
        ),
        fetchInvitations({ reset: true }),
      ])
    } catch (error) {
      openToast({
        title: getErrorMessage(error, '초대 응답 처리에 실패했습니다.'),
        tone: 'error',
      })
    } finally {
      setProcessingInvitationId(null)
    }
  }

  return (
    <DashboardLayout
      header={<DashboardHeader />}
      sidebar={
        <DashboardSidebar
          currentPage={sidebarPage}
          dashboards={sidebarDashboardState.dashboards}
          hasNextPage={sidebarPage < sidebarTotalPages}
          hasPreviousPage={sidebarPage > 1}
          onCreateDashboard={openCreateDashboardModal}
          onNextPage={() => setSidebarPage((prevPage) => prevPage + 1)}
          onPreviousPage={() => setSidebarPage((prevPage) => prevPage - 1)}
        />
      }
    >
      <div className="flex flex-col gap-6">
        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">환영합니다</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              {user?.nickname ?? 'Taskify 사용자'}님
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              내가 참여 중인 대시보드와 초대 목록을 이곳에서 관리할 수 있습니다.
            </p>
          </article>
          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">내 대시보드 수</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{dashboardState.totalCount}</p>
            <p className="mt-2 text-sm text-slate-500">페이지네이션 기준으로 조회됩니다.</p>
          </article>
          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">대기 중인 초대</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{invitations.length}</p>
            <p className="mt-2 text-sm text-slate-500">수락 또는 거절로 정리할 수 있습니다.</p>
          </article>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-taskify-primary-600">
                My Dashboards
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">내 대시보드</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">
                {dashboardPage} / {dashboardTotalPages} 페이지
              </span>
              <Button onClick={openCreateDashboardModal} size="sm">
                대시보드 생성
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {dashboardState.isLoading ? (
              Array.from({ length: 3 }).map((_, dashboardIndex) => (
                <div
                  className="h-36 animate-pulse rounded-[28px] bg-slate-100"
                  key={`dashboard-skeleton-${dashboardIndex}`}
                />
              ))
            ) : dashboardState.dashboards.length ? (
              dashboardState.dashboards.map((dashboard) => (
                <DashboardCard dashboard={dashboard} key={dashboard.id} />
              ))
            ) : (
              <div className="rounded-[28px] border border-dashed border-slate-200 px-6 py-12 text-center text-slate-400 lg:col-span-2 xl:col-span-3">
                아직 참여 중인 대시보드가 없습니다.
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <Button
              disabled={dashboardPage <= 1 || dashboardState.isLoading}
              onClick={() => setDashboardPage((prevPage) => prevPage - 1)}
              size="sm"
              variant="outline"
            >
              이전 페이지
            </Button>
            <Button
              disabled={dashboardPage >= dashboardTotalPages || dashboardState.isLoading}
              onClick={() => setDashboardPage((prevPage) => prevPage + 1)}
              size="sm"
              variant="outline"
            >
              다음 페이지
            </Button>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-taskify-primary-600">
                Invitations
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">초대받은 대시보드</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                검색은 클라이언트 필터링으로 처리되며, 스크롤 하단에 도달하면 자동으로 더
                불러옵니다.
              </p>
            </div>
            <div className="w-full md:max-w-sm">
              <Input
                label="초대받은 대시보드 검색"
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="대시보드 이름으로 검색"
                value={searchKeyword}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {isInitialInvitationLoading ? (
              Array.from({ length: 2 }).map((_, invitationIndex) => (
                <div
                  className="h-36 animate-pulse rounded-[28px] bg-slate-100"
                  key={`invitation-skeleton-${invitationIndex}`}
                />
              ))
            ) : filteredInvitations.length ? (
              filteredInvitations.map((invitation) => (
                <InvitationCard
                  invitation={invitation}
                  isProcessing={processingInvitationId === invitation.id}
                  key={invitation.id}
                  onAccept={(invitationId) => void handleInvitationDecision(invitationId, true)}
                  onReject={(invitationId) => void handleInvitationDecision(invitationId, false)}
                />
              ))
            ) : invitations.length ? (
              <div className="rounded-[28px] border border-dashed border-slate-200 px-6 py-12 text-center text-slate-400">
                검색 결과가 없습니다.
              </div>
            ) : (
              <div className="rounded-[28px] border border-dashed border-slate-200 px-6 py-12 text-center text-slate-400">
                아직 초대받은 대시보드가 없어요
              </div>
            )}

            <div className="h-1" ref={invitationObserverRef} />

            {isFetchingMoreInvitations ? (
              <p className="text-center text-sm text-slate-400">초대 목록을 더 불러오는 중...</p>
            ) : null}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
