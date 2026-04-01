import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ROUTE_PATH } from '@/app/routes/route-path'
import { CreateDashboardModalContent } from '@/features/dashboard/components/create-dashboard-modal-content'
import { InviteDashboardMemberModalContent } from '@/features/dashboard/components/invite-dashboard-member-modal-content'
import { deleteDashboardInvitation } from '@/features/dashboard/apis/deleteDashboardInvitation'
import { deleteMember } from '@/features/dashboard/apis/deleteMember'
import type { Dashboard, Invitation } from '@/features/dashboard/apis/dashboard.types'
import { getDashboard } from '@/features/dashboard/apis/getDashboard'
import { getDashboardInvitations } from '@/features/dashboard/apis/getDashboardInvitations'
import { getDashboards } from '@/features/dashboard/apis/getDashboards'
import { getMembers, type DashboardMember } from '@/features/dashboard/apis/getMembers'
import { updateDashboard } from '@/features/dashboard/apis/updateDashboard'
import { ApiError } from '@/shared/api/fetch'
import { Button } from '@/shared/components/button'
import { DashboardLayout } from '@/shared/components/dashboard-layout'
import { DashboardHeader } from '@/shared/components/header'
import { Input } from '@/shared/components/input'
import { useModal } from '@/shared/components/modal/useModal'
import { DashboardSidebar } from '@/shared/components/sidebar'
import { useToast } from '@/shared/components/toast/useToast'
import { DASHBOARD_COLOR_OPTIONS, SIDEBAR_DASHBOARD_PAGE_SIZE } from '@/shared/constants/dashboard'
import { formatDate } from '@/shared/utils/formatDate'

type DashboardListState = {
  dashboards: Dashboard[]
  isLoading: boolean
  totalCount: number
}

type MemberListState = {
  isLoading: boolean
  members: DashboardMember[]
  totalCount: number
}

type InvitationListState = {
  invitations: Invitation[]
  isLoading: boolean
  totalCount: number
}

const MEMBER_PAGE_SIZE = 5
const INVITATION_PAGE_SIZE = 5

const INITIAL_DASHBOARD_LIST_STATE: DashboardListState = {
  dashboards: [],
  isLoading: true,
  totalCount: 0,
}

const INITIAL_MEMBER_LIST_STATE: MemberListState = {
  isLoading: true,
  members: [],
  totalCount: 0,
}

const INITIAL_INVITATION_LIST_STATE: InvitationListState = {
  invitations: [],
  isLoading: true,
  totalCount: 0,
}

const createDashboardPath = (dashboardId: number) =>
  ROUTE_PATH.dashboard.replace(':dashboardId', String(dashboardId))

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}

const MemberAvatarGroup = ({ members }: { members: DashboardMember[] }) => {
  const visibleMembers = members.slice(0, 4)
  const hiddenMemberCount = members.length - visibleMembers.length

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-3">
        {visibleMembers.map((member) => (
          <div
            className="inline-flex size-9 items-center justify-center rounded-full border-2 border-white bg-taskify-primary-600 text-xs font-bold text-white"
            key={member.id}
            title={member.nickname}
          >
            {member.nickname.slice(0, 1).toUpperCase()}
          </div>
        ))}
      </div>
      {hiddenMemberCount > 0 ? (
        <span className="text-xs font-semibold text-slate-500">+{hiddenMemberCount}</span>
      ) : null}
    </div>
  )
}

const EmptySection = ({ message }: { message: string }) => {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-200 px-6 py-12 text-center text-sm text-slate-400">
      {message}
    </div>
  )
}

const ListPager = ({
  currentPage,
  hasNextPage,
  hasPreviousPage,
  onNext,
  onPrevious,
}: {
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  onNext: () => void
  onPrevious: () => void
}) => {
  return (
    <div className="mt-4 flex items-center justify-end gap-3">
      <Button disabled={!hasPreviousPage} onClick={onPrevious} size="sm" variant="outline">
        이전
      </Button>
      <span className="text-sm text-slate-500">{currentPage} 페이지</span>
      <Button disabled={!hasNextPage} onClick={onNext} size="sm" variant="outline">
        다음
      </Button>
    </div>
  )
}

export const DashboardEditPage = () => {
  const navigate = useNavigate()
  const { openModal } = useModal()
  const { openToast } = useToast()
  const { dashboardId } = useParams()
  const parsedDashboardId = Number(dashboardId)
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [formTitle, setFormTitle] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [isDashboardLoading, setIsDashboardLoading] = useState(true)
  const [isUpdatingDashboard, setIsUpdatingDashboard] = useState(false)
  const [members, setMembers] = useState(INITIAL_MEMBER_LIST_STATE)
  const [invitations, setInvitations] = useState(INITIAL_INVITATION_LIST_STATE)
  const [sidebarDashboardState, setSidebarDashboardState] = useState(INITIAL_DASHBOARD_LIST_STATE)
  const [memberPage, setMemberPage] = useState(1)
  const [invitationPage, setInvitationPage] = useState(1)
  const [sidebarPage, setSidebarPage] = useState(1)
  const [isMutatingMemberId, setIsMutatingMemberId] = useState<number | null>(null)
  const [isMutatingInvitationId, setIsMutatingInvitationId] = useState<number | null>(null)

  const fetchSidebarDashboards = useCallback(async () => {
    setSidebarDashboardState((prevState) => ({ ...prevState, isLoading: true }))

    try {
      const response = await getDashboards({
        navigationMethod: 'pagination',
        page: sidebarPage,
        size: SIDEBAR_DASHBOARD_PAGE_SIZE,
      })

      setSidebarDashboardState({
        dashboards: response.dashboards,
        isLoading: false,
        totalCount: response.totalCount,
      })
    } catch (error) {
      setSidebarDashboardState((prevState) => ({ ...prevState, isLoading: false }))
      openToast({
        title: getErrorMessage(error, '사이드바 대시보드를 불러오지 못했습니다.'),
        tone: 'error',
      })
    }
  }, [openToast, sidebarPage])

  const fetchDashboardDetail = useCallback(async () => {
    setIsDashboardLoading(true)

    try {
      const response = await getDashboard(parsedDashboardId)
      setDashboard(response)
      setFormTitle(response.title)
      setSelectedColor(response.color)
    } catch (error) {
      openToast({
        title: getErrorMessage(error, '대시보드 정보를 불러오지 못했습니다.'),
        tone: 'error',
      })
    } finally {
      setIsDashboardLoading(false)
    }
  }, [openToast, parsedDashboardId])

  const fetchMemberPage = useCallback(async () => {
    setMembers((prevState) => ({ ...prevState, isLoading: true }))

    try {
      const response = await getMembers(parsedDashboardId, memberPage, MEMBER_PAGE_SIZE)
      setMembers({
        isLoading: false,
        members: response.members,
        totalCount: response.totalCount,
      })
    } catch (error) {
      setMembers((prevState) => ({ ...prevState, isLoading: false }))
      openToast({
        title: getErrorMessage(error, '구성원 목록을 불러오지 못했습니다.'),
        tone: 'error',
      })
    }
  }, [memberPage, openToast, parsedDashboardId])

  const fetchInvitationPage = useCallback(async () => {
    setInvitations((prevState) => ({ ...prevState, isLoading: true }))

    try {
      const response = await getDashboardInvitations(
        parsedDashboardId,
        invitationPage,
        INVITATION_PAGE_SIZE,
      )
      setInvitations({
        invitations: response.invitations,
        isLoading: false,
        totalCount: response.totalCount,
      })
    } catch (error) {
      setInvitations((prevState) => ({ ...prevState, isLoading: false }))
      openToast({
        title: getErrorMessage(error, '초대 내역을 불러오지 못했습니다.'),
        tone: 'error',
      })
    }
  }, [invitationPage, openToast, parsedDashboardId])

  useEffect(() => {
    if (!Number.isFinite(parsedDashboardId)) {
      return
    }

    void fetchDashboardDetail()
  }, [fetchDashboardDetail, parsedDashboardId])

  useEffect(() => {
    if (!Number.isFinite(parsedDashboardId)) {
      return
    }

    void fetchMemberPage()
  }, [fetchMemberPage, parsedDashboardId])

  useEffect(() => {
    if (!Number.isFinite(parsedDashboardId)) {
      return
    }

    void fetchInvitationPage()
  }, [fetchInvitationPage, parsedDashboardId])

  useEffect(() => {
    void fetchSidebarDashboards()
  }, [fetchSidebarDashboards])

  const sidebarTotalPages = Math.max(
    1,
    Math.ceil(sidebarDashboardState.totalCount / SIDEBAR_DASHBOARD_PAGE_SIZE) || 1,
  )
  const memberTotalPages = Math.max(1, Math.ceil(members.totalCount / MEMBER_PAGE_SIZE) || 1)
  const invitationTotalPages = Math.max(
    1,
    Math.ceil(invitations.totalCount / INVITATION_PAGE_SIZE) || 1,
  )

  const isDashboardChanged =
    !!dashboard && (dashboard.title !== formTitle.trim() || dashboard.color !== selectedColor)

  const handleOpenCreateDashboardModal = () => {
    openModal({
      content: <CreateDashboardModalContent />,
      description: '대시보드 이름과 색상을 선택한 뒤 생성할 수 있습니다.',
      title: '새로운 대시보드',
    })
  }

  const handleOpenInviteModal = () => {
    if (!dashboard) {
      return
    }

    openModal({
      content: (
        <InviteDashboardMemberModalContent
          dashboardId={dashboard.id}
          onSuccess={() => {
            void fetchInvitationPage()
          }}
        />
      ),
      description: '대시보드에 함께 작업할 멤버의 이메일을 입력하세요.',
      title: '초대하기',
    })
  }

  const handleUpdateDashboard = async () => {
    if (!dashboard || !isDashboardChanged || isUpdatingDashboard || !formTitle.trim()) {
      return
    }

    setIsUpdatingDashboard(true)

    try {
      const updatedDashboard = await updateDashboard(dashboard.id, {
        color: selectedColor,
        title: formTitle.trim(),
      })
      setDashboard(updatedDashboard)
      setFormTitle(updatedDashboard.title)
      setSelectedColor(updatedDashboard.color)
      openToast({
        title: '대시보드가 변경되었습니다.',
        tone: 'success',
      })
      void fetchSidebarDashboards()
    } catch (error) {
      openToast({
        title: getErrorMessage(error, '대시보드 변경에 실패했습니다.'),
        tone: 'error',
      })
    } finally {
      setIsUpdatingDashboard(false)
    }
  }

  const handleDeleteMember = (member: DashboardMember) => {
    openModal({
      actions: [
        { label: '취소', tone: 'neutral' },
        {
          label: '삭제',
          onClick: async () => {
            setIsMutatingMemberId(member.id)

            try {
              await deleteMember(member.id)
              openToast({
                title: '구성원을 삭제했습니다.',
                tone: 'success',
              })
              void fetchMemberPage()
            } catch (error) {
              openToast({
                title: getErrorMessage(error, '구성원 삭제에 실패했습니다.'),
                tone: 'error',
              })
            } finally {
              setIsMutatingMemberId(null)
            }
          },
          tone: 'danger',
        },
      ],
      description: `${member.nickname} 님을 대시보드에서 제거합니다.`,
      title: '구성원을 삭제할까요?',
    })
  }

  const handleCancelInvitation = (invitation: Invitation) => {
    openModal({
      actions: [
        { label: '닫기', tone: 'neutral' },
        {
          label: '취소하기',
          onClick: async () => {
            setIsMutatingInvitationId(invitation.id)

            try {
              await deleteDashboardInvitation(parsedDashboardId, invitation.id)
              openToast({
                title: '초대를 취소했습니다.',
                tone: 'success',
              })
              void fetchInvitationPage()
            } catch (error) {
              openToast({
                title: getErrorMessage(error, '초대 취소에 실패했습니다.'),
                tone: 'error',
              })
            } finally {
              setIsMutatingInvitationId(null)
            }
          },
          tone: 'danger',
        },
      ],
      description: `${invitation.invitee.email} 초대를 취소합니다.`,
      title: '초대를 취소할까요?',
    })
  }

  const headerTitle = dashboard ? (
    <div className="min-w-0">
      <p className="truncate text-sm text-slate-400">Dashboard Settings</p>
      <div className="flex items-center gap-2">
        <h1 className="truncate text-xl font-bold text-slate-900">{dashboard.title}</h1>
        {dashboard.createdByMe ? <span aria-hidden="true">👑</span> : null}
      </div>
    </div>
  ) : null

  const headerActions = dashboard ? (
    <>
      <Button
        onClick={() => navigate(createDashboardPath(dashboard.id))}
        size="sm"
        variant="outline"
      >
        돌아가기
      </Button>
      <Button onClick={handleOpenInviteModal} size="sm">
        + 초대하기
      </Button>
      <MemberAvatarGroup members={members.members} />
    </>
  ) : null

  if (!Number.isFinite(parsedDashboardId)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-700">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
          잘못된 대시보드 경로입니다.
        </div>
      </main>
    )
  }

  if (!isDashboardLoading && dashboard && !dashboard.createdByMe) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-700">
        <div className="flex max-w-lg flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">수정 권한이 없습니다.</h1>
          <p className="text-sm leading-7 text-slate-500">
            대시보드 수정 페이지는 owner만 접근할 수 있습니다.
          </p>
          <div className="flex justify-center">
            <Button onClick={() => navigate(createDashboardPath(parsedDashboardId))}>
              대시보드로 돌아가기
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <DashboardLayout
      header={<DashboardHeader actions={headerActions} title={headerTitle} />}
      sidebar={
        <DashboardSidebar
          currentDashboardId={parsedDashboardId}
          currentPage={sidebarPage}
          dashboards={sidebarDashboardState.dashboards}
          hasNextPage={sidebarPage < sidebarTotalPages}
          hasPreviousPage={sidebarPage > 1}
          onCreateDashboard={handleOpenCreateDashboardModal}
          onNextPage={() => setSidebarPage((prevPage) => prevPage + 1)}
          onPreviousPage={() => setSidebarPage((prevPage) => prevPage - 1)}
        />
      }
    >
      <div className="flex flex-col gap-6">
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-taskify-primary-600">
                  Dashboard Settings
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">대시보드 정보 변경</h2>
              </div>
              {isDashboardLoading ? (
                <span className="text-sm text-slate-400">불러오는 중...</span>
              ) : null}
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
              <Input
                label="대시보드 이름"
                onChange={(event) => setFormTitle(event.target.value)}
                placeholder="대시보드 이름을 입력해 주세요"
                value={formTitle}
              />
              <Button
                disabled={!isDashboardChanged || isUpdatingDashboard || !formTitle.trim()}
                onClick={handleUpdateDashboard}
              >
                {isUpdatingDashboard ? '변경 중...' : '변경'}
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-slate-800">대시보드 색상</p>
              <div className="flex flex-wrap gap-3">
                {DASHBOARD_COLOR_OPTIONS.map((dashboardColor) => {
                  const isSelected = selectedColor === dashboardColor

                  return (
                    <button
                      aria-label={`대시보드 색상 ${dashboardColor}`}
                      className={`relative inline-flex size-11 items-center justify-center rounded-full border-2 transition ${
                        isSelected
                          ? 'border-slate-900 shadow-md'
                          : 'border-transparent hover:border-slate-300'
                      }`}
                      key={dashboardColor}
                      onClick={() => setSelectedColor(dashboardColor)}
                      style={{ backgroundColor: dashboardColor }}
                      type="button"
                    >
                      {isSelected ? <span className="text-lg font-bold text-white">✓</span> : null}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-taskify-primary-600">
                Members
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">구성원 관리</h2>
            </div>
            <span className="text-sm text-slate-500">총 {members.totalCount}명</span>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {members.isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  className="h-20 animate-pulse rounded-3xl bg-slate-100"
                  key={`member-skeleton-${index}`}
                />
              ))
            ) : members.members.length ? (
              members.members.map((member) => (
                <article
                  className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
                  key={member.id}
                >
                  <div className="flex items-center gap-4">
                    <span className="inline-flex size-12 items-center justify-center rounded-full bg-taskify-primary-600 text-sm font-bold text-white">
                      {member.nickname.slice(0, 1).toUpperCase()}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">{member.nickname}</p>
                        {member.isOwner ? <span aria-hidden="true">👑</span> : null}
                      </div>
                      <p className="text-sm text-slate-500">{member.email}</p>
                    </div>
                  </div>
                  <Button
                    disabled={member.isOwner || isMutatingMemberId === member.id}
                    onClick={() => handleDeleteMember(member)}
                    size="sm"
                    variant="outline"
                  >
                    {isMutatingMemberId === member.id ? '삭제 중...' : '삭제'}
                  </Button>
                </article>
              ))
            ) : (
              <EmptySection message="표시할 구성원이 없습니다." />
            )}
          </div>

          <ListPager
            currentPage={memberPage}
            hasNextPage={memberPage < memberTotalPages}
            hasPreviousPage={memberPage > 1}
            onNext={() => setMemberPage((prevPage) => prevPage + 1)}
            onPrevious={() => setMemberPage((prevPage) => prevPage - 1)}
          />
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-taskify-primary-600">
                Invitations
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">초대 내역 관리</h2>
            </div>
            <Button onClick={handleOpenInviteModal} size="sm">
              + 초대하기
            </Button>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {invitations.isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  className="h-24 animate-pulse rounded-3xl bg-slate-100"
                  key={`invitation-skeleton-${index}`}
                />
              ))
            ) : invitations.invitations.length ? (
              invitations.invitations.map((invitation) => (
                <article
                  className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
                  key={invitation.id}
                >
                  <div>
                    <p className="font-semibold text-slate-900">{invitation.invitee.email}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      초대 시각: {formatDate(invitation.createdAt)}
                    </p>
                  </div>
                  <Button
                    disabled={isMutatingInvitationId === invitation.id}
                    onClick={() => handleCancelInvitation(invitation)}
                    size="sm"
                    variant="outline"
                  >
                    {isMutatingInvitationId === invitation.id ? '취소 중...' : '취소'}
                  </Button>
                </article>
              ))
            ) : (
              <EmptySection message="아직 초대 내역이 없습니다." />
            )}
          </div>

          <ListPager
            currentPage={invitationPage}
            hasNextPage={invitationPage < invitationTotalPages}
            hasPreviousPage={invitationPage > 1}
            onNext={() => setInvitationPage((prevPage) => prevPage + 1)}
            onPrevious={() => setInvitationPage((prevPage) => prevPage - 1)}
          />
        </section>
      </div>
    </DashboardLayout>
  )
}
