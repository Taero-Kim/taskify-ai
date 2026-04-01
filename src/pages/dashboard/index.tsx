import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ROUTE_PATH } from '@/app/routes/route-path'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { CardFormModalContent } from '@/features/card/components/card-form-modal-content'
import { getCard } from '@/features/card/apis/getCard'
import { getCards } from '@/features/card/apis/getCards'
import { updateCard } from '@/features/card/apis/updateCard'
import { CreateColumnModalContent } from '@/features/column/components/create-column-modal-content'
import { ManageColumnModalContent } from '@/features/column/components/manage-column-modal-content'
import { getColumns } from '@/features/column/apis/getColumns'
import { createComment } from '@/features/comment/apis/createComment'
import { deleteComment } from '@/features/comment/apis/deleteComment'
import { getComments } from '@/features/comment/apis/getComments'
import { updateComment } from '@/features/comment/apis/updateComment'
import { CreateDashboardModalContent } from '@/features/dashboard/components/create-dashboard-modal-content'
import { InviteDashboardMemberModalContent } from '@/features/dashboard/components/invite-dashboard-member-modal-content'
import type { Dashboard } from '@/features/dashboard/apis/dashboard.types'
import type { Card } from '@/features/card/apis/card.types'
import type { Column } from '@/features/column/apis/column.types'
import type { Comment } from '@/features/comment/apis/comment.types'
import { getDashboard } from '@/features/dashboard/apis/getDashboard'
import { getDashboards } from '@/features/dashboard/apis/getDashboards'
import { getMembers, type DashboardMember } from '@/features/dashboard/apis/getMembers'
import { ApiError } from '@/shared/api/fetch'
import { Button } from '@/shared/components/button'
import { DashboardLayout } from '@/shared/components/dashboard-layout'
import { Dropdown } from '@/shared/components/dropdown'
import { DashboardHeader } from '@/shared/components/header'
import { useModal } from '@/shared/components/modal/useModal'
import { DashboardSidebar } from '@/shared/components/sidebar'
import { useToast } from '@/shared/components/toast/useToast'
import { SIDEBAR_DASHBOARD_PAGE_SIZE } from '@/shared/constants/dashboard'
import { formatDate } from '@/shared/utils/formatDate'

const createDashboardEditPath = (dashboardId: number) =>
  ROUTE_PATH.dashboardEdit.replace(':dashboardId', String(dashboardId))

type DashboardListState = {
  dashboards: Dashboard[]
  isLoading: boolean
  totalCount: number
}

type ColumnCardState = {
  cards: Card[]
  isInitialLoading: boolean
  isLoadingMore: boolean
  totalCount: number
}

type ColumnPaginationState = {
  cursorId?: number
  hasMore: boolean
  isFetching: boolean
}

const INITIAL_DASHBOARD_LIST_STATE: DashboardListState = {
  dashboards: [],
  isLoading: true,
  totalCount: 0,
}

const INITIAL_COLUMN_PAGINATION_STATE: ColumnPaginationState = {
  cursorId: undefined,
  hasMore: true,
  isFetching: false,
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

const ColumnCardList = ({
  cards,
  columnId,
  hasMore,
  isInitialLoading,
  isLoadingMore,
  onCreateCard,
  onLoadMore,
  onMoveCardDown,
  onMoveCardUp,
  onOpenCard,
}: {
  cards: Card[]
  columnId: number
  hasMore: boolean
  isInitialLoading: boolean
  isLoadingMore: boolean
  onCreateCard: (columnId: number) => void
  onLoadMore: (columnId: number) => void
  onMoveCardDown: (columnId: number, cardId: number) => void
  onMoveCardUp: (columnId: number, cardId: number) => void
  onOpenCard: (card: Card) => void
}) => {
  const observerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!observerRef.current || !hasMore || isLoadingMore || isInitialLoading) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore(columnId)
        }
      },
      { rootMargin: '180px 0px' },
    )

    observer.observe(observerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [columnId, hasMore, isInitialLoading, isLoadingMore, onLoadMore])

  return (
    <div className="mt-4 flex flex-1 flex-col gap-3">
      <Button className="w-full" onClick={() => onCreateCard(columnId)} size="sm" variant="outline">
        + 새 카드 추가
      </Button>

      <div className="flex flex-1 flex-col gap-3">
        {isInitialLoading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <div
              className="h-28 animate-pulse rounded-3xl bg-slate-100"
              key={`card-skeleton-${columnId}-${index}`}
            />
          ))
        ) : cards.length ? (
          cards.map((card, cardIndex) => (
            <button
              className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-taskify-primary-400 hover:shadow-md"
              key={card.id}
              onClick={() => onOpenCard(card)}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
                  {card.title}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={cardIndex === 0}
                    onClick={(event) => {
                      event.stopPropagation()
                      onMoveCardUp(columnId, card.id)
                    }}
                    type="button"
                  >
                    ↑
                  </button>
                  <button
                    className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={cardIndex === cards.length - 1}
                    onClick={(event) => {
                      event.stopPropagation()
                      onMoveCardDown(columnId, card.id)
                    }}
                    type="button"
                  >
                    ↓
                  </button>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">
                    {formatDate(card.dueDate)}
                  </span>
                </div>
              </div>
              <p className="line-clamp-3 text-sm leading-6 text-slate-500">{card.description}</p>
              <div className="flex flex-wrap items-center gap-2">
                {card.tags.map((tag) => (
                  <span
                    className="rounded-full bg-taskify-primary-100 px-2.5 py-1 text-xs font-semibold text-taskify-primary-700"
                    key={`${card.id}-${tag}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
                <span>{card.assignee?.nickname ?? '담당자 없음'}</span>
                <span>#{card.id}</span>
              </div>
            </button>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400">
            아직 카드가 없습니다.
          </div>
        )}
      </div>

      <div className="h-1" ref={observerRef} />
      {isLoadingMore ? (
        <p className="text-center text-xs text-slate-400">카드를 더 불러오는 중...</p>
      ) : null}
    </div>
  )
}

const CardDetailModalContent = ({
  cardId,
  columnId,
  columns,
  dashboardId,
  members,
  onBoardRefresh,
}: {
  cardId: number
  columnId: number
  columns: Column[]
  dashboardId: number
  members: DashboardMember[]
  onBoardRefresh: () => void
}) => {
  const { user } = useAuth()
  const { openModal } = useModal()
  const { openToast } = useToast()
  const commentObserverRef = useRef<HTMLDivElement | null>(null)
  const commentCursorRef = useRef<number | undefined>(undefined)
  const commentsRef = useRef<Comment[]>([])
  const hasMoreCommentsRef = useRef(true)
  const isFetchingCommentsRef = useRef(false)
  const [card, setCard] = useState<Card | null>(null)
  const [isCardLoading, setIsCardLoading] = useState(true)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentContent, setCommentContent] = useState('')
  const [selectedMoveColumnId, setSelectedMoveColumnId] = useState(String(columnId))
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingCommentContent, setEditingCommentContent] = useState('')
  const [isInitialCommentsLoading, setIsInitialCommentsLoading] = useState(true)
  const [isFetchingMoreComments, setIsFetchingMoreComments] = useState(false)
  const [isMovingCard, setIsMovingCard] = useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isUpdatingCommentId, setIsUpdatingCommentId] = useState<number | null>(null)

  const fetchComments = useCallback(
    async (options?: { reset?: boolean }) => {
      const shouldReset = options?.reset ?? false

      if (isFetchingCommentsRef.current) {
        return
      }

      if (!shouldReset && !hasMoreCommentsRef.current) {
        return
      }

      if (shouldReset) {
        setIsInitialCommentsLoading(true)
        commentsRef.current = []
        setComments([])
        commentCursorRef.current = undefined
        hasMoreCommentsRef.current = true
      } else {
        setIsFetchingMoreComments(true)
      }

      isFetchingCommentsRef.current = true

      try {
        const response = await getComments(
          cardId,
          shouldReset ? undefined : commentCursorRef.current,
        )
        const nextComments = shouldReset
          ? response.comments
          : [...commentsRef.current, ...response.comments]
        const dedupedComments = nextComments.filter(
          (comment, commentIndex, commentArray) =>
            commentArray.findIndex(({ id }) => id === comment.id) === commentIndex,
        )

        commentsRef.current = dedupedComments
        setComments(dedupedComments)
        commentCursorRef.current = response.cursorId ?? undefined
        hasMoreCommentsRef.current = response.cursorId !== null
      } catch (error) {
        openToast({
          title: getErrorMessage(error, '댓글을 불러오지 못했습니다.'),
          tone: 'error',
        })
      } finally {
        isFetchingCommentsRef.current = false
        setIsInitialCommentsLoading(false)
        setIsFetchingMoreComments(false)
      }
    },
    [cardId, openToast],
  )

  useEffect(() => {
    const fetchCardDetail = async () => {
      setIsCardLoading(true)

      try {
        const response = await getCard(cardId)
        setCard(response)
        setSelectedMoveColumnId(String(response.columnId))
      } catch (error) {
        openToast({
          title: getErrorMessage(error, '카드 상세 정보를 불러오지 못했습니다.'),
          tone: 'error',
        })
      } finally {
        setIsCardLoading(false)
      }
    }

    void fetchCardDetail()
  }, [cardId, openToast])

  useEffect(() => {
    void fetchComments({ reset: true })
  }, [fetchComments])

  useEffect(() => {
    if (!commentObserverRef.current || !hasMoreCommentsRef.current) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void fetchComments()
        }
      },
      { rootMargin: '120px 0px' },
    )

    observer.observe(commentObserverRef.current)

    return () => {
      observer.disconnect()
    }
  }, [fetchComments])

  const handleSubmitComment = async () => {
    if (!card || !commentContent.trim() || isSubmittingComment) {
      return
    }

    setIsSubmittingComment(true)

    try {
      const createdComment = await createComment({
        cardId,
        columnId: card.columnId,
        content: commentContent.trim(),
        dashboardId,
      })

      commentsRef.current = [createdComment, ...commentsRef.current]
      setComments(commentsRef.current)
      setCommentContent('')
      openToast({
        title: '댓글이 등록되었습니다.',
        tone: 'success',
      })
    } catch (error) {
      openToast({
        title: getErrorMessage(error, '댓글 등록에 실패했습니다.'),
        tone: 'error',
      })
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleMoveCard = async () => {
    if (!card || isMovingCard || String(card.columnId) === selectedMoveColumnId) {
      return
    }

    setIsMovingCard(true)

    try {
      const updatedCard = await updateCard(card.id, {
        columnId: Number(selectedMoveColumnId),
      })

      setCard(updatedCard)
      setSelectedMoveColumnId(String(updatedCard.columnId))
      onBoardRefresh()
      openToast({
        title: '카드가 다른 컬럼으로 이동되었습니다.',
        tone: 'success',
      })
    } catch (error) {
      openToast({
        title: getErrorMessage(error, '카드 이동에 실패했습니다.'),
        tone: 'error',
      })
    } finally {
      setIsMovingCard(false)
    }
  }

  const handleUpdateComment = async (commentId: number) => {
    if (!editingCommentContent.trim() || isUpdatingCommentId) {
      return
    }

    setIsUpdatingCommentId(commentId)

    try {
      const updatedComment = await updateComment(commentId, {
        content: editingCommentContent.trim(),
      })
      commentsRef.current = commentsRef.current.map((comment) =>
        comment.id === commentId ? updatedComment : comment,
      )
      setComments(commentsRef.current)
      setEditingCommentId(null)
      setEditingCommentContent('')
      openToast({
        title: '댓글이 수정되었습니다.',
        tone: 'success',
      })
    } catch (error) {
      openToast({
        title: getErrorMessage(error, '댓글 수정에 실패했습니다.'),
        tone: 'error',
      })
    } finally {
      setIsUpdatingCommentId(null)
    }
  }

  const handleDeleteComment = (commentId: number) => {
    openModal({
      actions: [
        { label: '취소', tone: 'neutral' },
        {
          label: '삭제하기',
          onClick: async () => {
            try {
              await deleteComment(commentId)
              commentsRef.current = commentsRef.current.filter(
                (comment) => comment.id !== commentId,
              )
              setComments(commentsRef.current)
              openToast({
                title: '댓글을 삭제했습니다.',
                tone: 'success',
              })
            } catch (error) {
              openToast({
                title: getErrorMessage(error, '댓글 삭제에 실패했습니다.'),
                tone: 'error',
              })
            }
          },
          tone: 'danger',
        },
      ],
      description: '삭제한 댓글은 복구할 수 없습니다.',
      title: '댓글을 삭제할까요?',
    })
  }

  const openCardEditModal = () => {
    if (!card) {
      return
    }

    openModal({
      content: (
        <CardFormModalContent
          card={card}
          columnId={card.columnId}
          columns={columns}
          dashboardId={dashboardId}
          members={members}
          mode="edit"
          onDeleted={() => {
            onBoardRefresh()
          }}
          onSubmitted={(updatedCard) => {
            if (updatedCard) {
              setCard(updatedCard)
            }
            onBoardRefresh()
          }}
        />
      ),
      description: '카드 정보를 수정하거나 삭제할 수 있습니다.',
      title: '카드 수정하기',
    })
  }

  if (isCardLoading) {
    return <div className="h-80 animate-pulse rounded-3xl bg-slate-100" />
  }

  if (!card) {
    return <p className="text-sm text-slate-500">카드 정보를 불러올 수 없습니다.</p>
  }

  return (
    <div className="flex max-h-[72vh] flex-col gap-6 overflow-hidden">
      <div className="flex flex-col gap-4 overflow-y-auto pr-1">
        <div className="flex flex-col gap-3 rounded-3xl bg-slate-50 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{card.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                {formatDate(card.dueDate)}
              </span>
              <Dropdown
                content={
                  <div className="flex flex-col gap-1">
                    <Button
                      className="w-full justify-start"
                      onClick={openCardEditModal}
                      size="sm"
                      variant="ghost"
                    >
                      수정하기
                    </Button>
                  </div>
                }
              >
                <button
                  className="rounded-full bg-white px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  type="button"
                >
                  ⋯
                </button>
              </Dropdown>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {card.tags.length ? (
              card.tags.map((tag) => (
                <span
                  className="rounded-full bg-taskify-primary-100 px-2.5 py-1 text-xs font-semibold text-taskify-primary-700"
                  key={`${card.id}-${tag}`}
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-400">태그가 없습니다.</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span>담당자: {card.assignee?.nickname ?? '없음'}</span>
            <span>생성일: {formatDate(card.createdAt)}</span>
            <span>카드 ID #{card.id}</span>
          </div>
          <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_auto] md:items-end">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-800" htmlFor="card-move-column">
                컬럼 이동
              </label>
              <select
                className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-taskify-primary-500 focus:ring-2 focus:ring-taskify-primary-100"
                id="card-move-column"
                onChange={(event) => setSelectedMoveColumnId(event.target.value)}
                value={selectedMoveColumnId}
              >
                {columns.map((columnOption) => (
                  <option key={columnOption.id} value={columnOption.id}>
                    {columnOption.title}
                  </option>
                ))}
              </select>
            </div>
            <Button
              disabled={isMovingCard || String(card.columnId) === selectedMoveColumnId}
              onClick={handleMoveCard}
            >
              {isMovingCard ? '이동 중...' : '저장'}
            </Button>
          </div>
        </div>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-slate-900">댓글</h4>
            <span className="text-sm text-slate-400">{comments.length}개</span>
          </div>

          <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4">
            <textarea
              className="min-h-28 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-taskify-primary-500 focus:ring-2 focus:ring-taskify-primary-100"
              onChange={(event) => setCommentContent(event.target.value)}
              placeholder="댓글을 입력해 주세요"
              value={commentContent}
            />
            <div className="flex justify-between gap-3 text-xs text-slate-400">
              <span>{user?.nickname ?? '사용자'}로 작성됩니다.</span>
              <Button
                disabled={!commentContent.trim() || isSubmittingComment}
                onClick={handleSubmitComment}
                size="sm"
              >
                {isSubmittingComment ? '등록 중...' : '입력'}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {isInitialCommentsLoading ? (
              Array.from({ length: 2 }).map((_, index) => (
                <div
                  className="h-24 animate-pulse rounded-3xl bg-slate-100"
                  key={`comment-skeleton-${index}`}
                />
              ))
            ) : comments.length ? (
              comments.map((comment) => (
                <article
                  className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                  key={comment.id}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{comment.author.nickname}</p>
                      <p className="text-xs text-slate-400">{formatDate(comment.updatedAt)}</p>
                    </div>
                    {comment.author.id === user?.id ? (
                      <div className="flex items-center gap-2">
                        {editingCommentId === comment.id ? null : (
                          <Button
                            onClick={() => {
                              setEditingCommentId(comment.id)
                              setEditingCommentContent(comment.content)
                            }}
                            size="sm"
                            variant="ghost"
                          >
                            수정
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDeleteComment(comment.id)}
                          size="sm"
                          variant="ghost"
                        >
                          삭제
                        </Button>
                      </div>
                    ) : null}
                  </div>
                  {editingCommentId === comment.id ? (
                    <div className="mt-3 flex flex-col gap-3">
                      <textarea
                        className="min-h-24 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-taskify-primary-500 focus:ring-2 focus:ring-taskify-primary-100"
                        onChange={(event) => setEditingCommentContent(event.target.value)}
                        value={editingCommentContent}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => {
                            setEditingCommentId(null)
                            setEditingCommentContent('')
                          }}
                          size="sm"
                          variant="outline"
                        >
                          취소
                        </Button>
                        <Button
                          disabled={
                            !editingCommentContent.trim() || isUpdatingCommentId === comment.id
                          }
                          onClick={() => void handleUpdateComment(comment.id)}
                          size="sm"
                        >
                          {isUpdatingCommentId === comment.id ? '저장 중...' : '저장'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm leading-7 text-slate-600">{comment.content}</p>
                  )}
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400">
                아직 등록된 댓글이 없습니다.
              </div>
            )}
            <div className="h-1" ref={commentObserverRef} />
            {isFetchingMoreComments ? (
              <p className="text-center text-xs text-slate-400">댓글을 더 불러오는 중...</p>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
}

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { openModal } = useModal()
  const { openToast } = useToast()
  const { dashboardId } = useParams()
  const parsedDashboardId = Number(dashboardId)
  const paginationRef = useRef<Record<number, ColumnPaginationState>>({})
  const columnCardsRef = useRef<Record<number, Card[]>>({})
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [members, setMembers] = useState<DashboardMember[]>([])
  const [columns, setColumns] = useState<Column[]>([])
  const [columnCards, setColumnCards] = useState<Record<number, ColumnCardState>>({})
  const [isDashboardLoading, setIsDashboardLoading] = useState(true)
  const [isColumnsLoading, setIsColumnsLoading] = useState(true)
  const [sidebarPage, setSidebarPage] = useState(1)
  const [sidebarDashboardState, setSidebarDashboardState] = useState(INITIAL_DASHBOARD_LIST_STATE)

  const fetchSidebarDashboards = useCallback(async () => {
    setSidebarDashboardState((prevState) => ({
      ...prevState,
      isLoading: true,
    }))

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
      setSidebarDashboardState((prevState) => ({
        ...prevState,
        isLoading: false,
      }))
      openToast({
        title: getErrorMessage(error, '사이드바 대시보드를 불러오지 못했습니다.'),
        tone: 'error',
      })
    }
  }, [openToast, sidebarPage])

  const fetchColumnCards = useCallback(
    async (columnId: number, options?: { reset?: boolean }) => {
      const shouldReset = options?.reset ?? false
      const paginationState = paginationRef.current[columnId] ?? INITIAL_COLUMN_PAGINATION_STATE

      if (paginationState.isFetching) {
        return
      }

      if (!shouldReset && !paginationState.hasMore) {
        return
      }

      paginationRef.current[columnId] = {
        ...(shouldReset ? INITIAL_COLUMN_PAGINATION_STATE : paginationState),
        isFetching: true,
      }

      setColumnCards((prevCards) => ({
        ...prevCards,
        [columnId]: {
          cards: shouldReset ? [] : (prevCards[columnId]?.cards ?? []),
          isInitialLoading: shouldReset,
          isLoadingMore: !shouldReset,
          totalCount: prevCards[columnId]?.totalCount ?? 0,
        },
      }))

      try {
        const response = await getCards(
          columnId,
          shouldReset ? undefined : paginationState.cursorId,
        )
        const prevCards = shouldReset ? [] : (columnCardsRef.current[columnId] ?? [])
        const mergedCards = [...prevCards, ...response.cards].filter(
          (card, cardIndex, cardArray) =>
            cardArray.findIndex(({ id }) => id === card.id) === cardIndex,
        )

        columnCardsRef.current[columnId] = mergedCards
        paginationRef.current[columnId] = {
          cursorId: response.cursorId ?? undefined,
          hasMore: response.cursorId !== null,
          isFetching: false,
        }

        setColumnCards((currentCards) => ({
          ...currentCards,
          [columnId]: {
            cards: mergedCards,
            isInitialLoading: false,
            isLoadingMore: false,
            totalCount: response.totalCount,
          },
        }))
      } catch (error) {
        paginationRef.current[columnId] = {
          ...(shouldReset ? INITIAL_COLUMN_PAGINATION_STATE : paginationState),
          isFetching: false,
        }

        setColumnCards((currentCards) => ({
          ...currentCards,
          [columnId]: {
            cards: currentCards[columnId]?.cards ?? [],
            isInitialLoading: false,
            isLoadingMore: false,
            totalCount: currentCards[columnId]?.totalCount ?? 0,
          },
        }))

        openToast({
          title: getErrorMessage(error, '카드 목록을 불러오지 못했습니다.'),
          tone: 'error',
        })
      }
    },
    [openToast],
  )

  const fetchColumnsOnly = useCallback(async () => {
    setIsColumnsLoading(true)

    try {
      const columnResponse = await getColumns(parsedDashboardId)
      setColumns(columnResponse.data ?? [])
    } catch (error) {
      openToast({
        title: getErrorMessage(error, '컬럼 목록을 불러오지 못했습니다.'),
        tone: 'error',
      })
    } finally {
      setIsColumnsLoading(false)
    }
  }, [openToast, parsedDashboardId])

  const refreshAllColumnCards = useCallback(() => {
    columns.forEach((column) => {
      void fetchColumnCards(column.id, { reset: true })
    })
  }, [columns, fetchColumnCards])

  const reorderCardsInColumn = useCallback(
    (columnId: number, fromIndex: number, toIndex: number) => {
      setColumnCards((prevCards) => {
        const targetCards = [...(prevCards[columnId]?.cards ?? [])]

        if (
          fromIndex < 0 ||
          toIndex < 0 ||
          fromIndex >= targetCards.length ||
          toIndex >= targetCards.length
        ) {
          return prevCards
        }

        const [movedCard] = targetCards.splice(fromIndex, 1)
        targetCards.splice(toIndex, 0, movedCard)
        columnCardsRef.current[columnId] = targetCards

        return {
          ...prevCards,
          [columnId]: {
            ...(prevCards[columnId] ?? {
              cards: [],
              isInitialLoading: false,
              isLoadingMore: false,
              totalCount: 0,
            }),
            cards: targetCards,
          },
        }
      })
    },
    [],
  )

  const moveCardUp = useCallback(
    (columnId: number, cardId: number) => {
      const cards = columnCardsRef.current[columnId] ?? []
      const currentIndex = cards.findIndex((card) => card.id === cardId)

      if (currentIndex <= 0) {
        return
      }

      reorderCardsInColumn(columnId, currentIndex, currentIndex - 1)
    },
    [reorderCardsInColumn],
  )

  const moveCardDown = useCallback(
    (columnId: number, cardId: number) => {
      const cards = columnCardsRef.current[columnId] ?? []
      const currentIndex = cards.findIndex((card) => card.id === cardId)

      if (currentIndex < 0 || currentIndex >= cards.length - 1) {
        return
      }

      reorderCardsInColumn(columnId, currentIndex, currentIndex + 1)
    },
    [reorderCardsInColumn],
  )

  useEffect(() => {
    if (!Number.isFinite(parsedDashboardId)) {
      return
    }

    const fetchDashboardData = async () => {
      setIsDashboardLoading(true)
      setIsColumnsLoading(true)

      try {
        const [dashboardResponse, memberResponse, columnResponse] = await Promise.all([
          getDashboard(parsedDashboardId),
          getMembers(parsedDashboardId),
          getColumns(parsedDashboardId),
        ])

        setDashboard(dashboardResponse)
        setMembers(memberResponse.members)
        setColumns(columnResponse.data ?? [])
      } catch (error) {
        openToast({
          title: getErrorMessage(error, '대시보드 정보를 불러오지 못했습니다.'),
          tone: 'error',
        })
      } finally {
        setIsDashboardLoading(false)
        setIsColumnsLoading(false)
      }
    }

    void fetchDashboardData()
  }, [openToast, parsedDashboardId])

  useEffect(() => {
    if (!columns.length) {
      return
    }

    columns.forEach((column) => {
      void fetchColumnCards(column.id, { reset: true })
    })
  }, [columns, fetchColumnCards])

  useEffect(() => {
    void fetchSidebarDashboards()
  }, [fetchSidebarDashboards])

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

  const openInviteModal = () => {
    if (!dashboard) {
      return
    }

    openModal({
      content: (
        <InviteDashboardMemberModalContent
          dashboardId={dashboard.id}
          onSuccess={() => {
            void getMembers(parsedDashboardId).then((response) => setMembers(response.members))
          }}
        />
      ),
      description: '대시보드에 함께 작업할 멤버의 이메일을 입력하세요.',
      title: '초대하기',
    })
  }

  const openCreateColumnModal = () => {
    openModal({
      content: (
        <CreateColumnModalContent
          columnCount={columns.length}
          dashboardId={parsedDashboardId}
          existingTitles={columns.map((column) => column.title)}
          onSuccess={() => {
            void fetchColumnsOnly()
          }}
        />
      ),
      description: '새로운 컬럼 이름을 입력해 주세요.',
      title: '새로운 컬럼 추가하기',
    })
  }

  const openManageColumnModal = (column: Column) => {
    openModal({
      content: (
        <ManageColumnModalContent
          column={column}
          existingTitles={columns.map((currentColumn) => currentColumn.title)}
          onDeleted={() => {
            void fetchColumnsOnly()
          }}
          onUpdated={() => {
            void fetchColumnsOnly()
          }}
        />
      ),
      description: '컬럼 이름을 변경하거나 삭제할 수 있습니다.',
      title: '컬럼 관리',
    })
  }

  const openCreateCardModal = (targetColumnId: number) => {
    openModal({
      content: (
        <CardFormModalContent
          columnId={targetColumnId}
          columns={columns}
          dashboardId={parsedDashboardId}
          members={members}
          mode="create"
          onSubmitted={() => {
            refreshAllColumnCards()
          }}
        />
      ),
      description: '새로운 할 일 카드를 생성할 수 있습니다.',
      title: '새 카드 추가',
    })
  }

  const openCardDetailModal = (card: Card) => {
    openModal({
      content: (
        <CardDetailModalContent
          cardId={card.id}
          columnId={card.columnId}
          columns={columns}
          dashboardId={parsedDashboardId}
          members={members}
          onBoardRefresh={refreshAllColumnCards}
        />
      ),
      description: '카드 상세 정보와 댓글 흐름을 확인할 수 있습니다.',
      title: '할 일 카드 상세',
    })
  }

  const headerTitle = dashboard ? (
    <div className="min-w-0">
      <p className="truncate text-sm text-slate-400">Dashboard</p>
      <div className="flex items-center gap-2">
        <h1 className="truncate text-xl font-bold text-slate-900">{dashboard.title}</h1>
        {dashboard.createdByMe ? <span aria-hidden="true">👑</span> : null}
      </div>
    </div>
  ) : null

  const headerActions = dashboard ? (
    <>
      {dashboard.createdByMe ? (
        <Button
          onClick={() => navigate(createDashboardEditPath(dashboard.id))}
          size="sm"
          variant="outline"
        >
          관리
        </Button>
      ) : null}
      {dashboard.createdByMe ? (
        <Button onClick={openInviteModal} size="sm" variant="primary">
          + 초대하기
        </Button>
      ) : null}
      <MemberAvatarGroup members={members} />
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
          onCreateDashboard={openCreateDashboardModal}
          onNextPage={() => setSidebarPage((prevPage) => prevPage + 1)}
          onPreviousPage={() => setSidebarPage((prevPage) => prevPage - 1)}
        />
      }
    >
      <div className="flex flex-col gap-6">
        {isDashboardLoading ? (
          <div className="h-24 animate-pulse rounded-[32px] bg-slate-200" />
        ) : null}

        <section className="flex flex-col gap-4 lg:flex-row lg:overflow-x-auto">
          {isColumnsLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                className="h-[420px] rounded-[32px] bg-slate-200 lg:min-w-[320px]"
                key={`column-skeleton-${index}`}
              />
            ))
          ) : columns.length ? (
            <>
              {columns.map((column) => {
                const cardState = columnCards[column.id] ?? {
                  cards: [],
                  isInitialLoading: true,
                  isLoadingMore: false,
                  totalCount: 0,
                }
                const paginationState =
                  paginationRef.current[column.id] ?? INITIAL_COLUMN_PAGINATION_STATE

                return (
                  <section
                    className="flex min-h-[440px] flex-col rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm lg:min-w-[320px] lg:max-w-[360px] lg:flex-1"
                    key={column.id}
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold text-slate-900">{column.title}</h2>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
                          {cardState.totalCount}
                        </span>
                      </div>
                      <button
                        aria-label="컬럼 설정"
                        className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        onClick={() => openManageColumnModal(column)}
                        type="button"
                      >
                        ⚙️
                      </button>
                    </div>

                    <ColumnCardList
                      cards={cardState.cards}
                      columnId={column.id}
                      hasMore={paginationState.hasMore}
                      isInitialLoading={cardState.isInitialLoading}
                      isLoadingMore={cardState.isLoadingMore}
                      onCreateCard={openCreateCardModal}
                      onLoadMore={(targetColumnId) => {
                        void fetchColumnCards(targetColumnId)
                      }}
                      onMoveCardDown={moveCardDown}
                      onMoveCardUp={moveCardUp}
                      onOpenCard={openCardDetailModal}
                    />
                  </section>
                )
              })}

              <button
                className="flex min-h-[440px] items-center justify-center rounded-[32px] border border-dashed border-slate-300 bg-white px-8 text-base font-semibold text-slate-500 transition hover:border-taskify-primary-500 hover:text-taskify-primary-700 lg:min-w-[280px]"
                onClick={openCreateColumnModal}
                type="button"
              >
                + 새로운 컬럼 추가하기
              </button>
            </>
          ) : (
            <div className="rounded-[32px] border border-dashed border-slate-300 bg-white px-8 py-20 text-center text-slate-400">
              표시할 컬럼이 없습니다.
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  )
}
