import { useEffect, useMemo, useRef, useState } from 'react'

import { changePassword } from '@/features/auth/apis/changePassword'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ApiError } from '@/shared/api/fetch'
import { Button } from '@/shared/components/button'
import { DashboardHeader } from '@/shared/components/header'
import { Input } from '@/shared/components/input'
import { useModal } from '@/shared/components/modal/useModal'
import { useToast } from '@/shared/components/toast/useToast'
import { uploadMyImage } from '@/features/user/apis/uploadMyImage'
import { updateMyInfo } from '@/features/user/apis/updateMyInfo'
import { validateNickname } from '@/shared/utils/validateNickname'
import { validatePassword } from '@/shared/utils/validatePassword'

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}

type PasswordField = 'newPasswordConfirmation'

export const MyPage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { user, refreshUser } = useAuth()
  const { openModal } = useModal()
  const { openToast } = useToast()
  const [nickname, setNickname] = useState(user?.nickname ?? '')
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [touchedFields, setTouchedFields] = useState<Record<PasswordField, boolean>>({
    newPasswordConfirmation: false,
  })

  useEffect(() => {
    setNickname(user?.nickname ?? '')
    setPreviewImageUrl(user?.profileImageUrl ?? null)
  }, [user?.nickname, user?.profileImageUrl])

  useEffect(() => {
    return () => {
      if (previewImageUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewImageUrl)
      }
    }
  }, [previewImageUrl])

  const nicknameErrorMessage =
    nickname.trim() && !validateNickname(nickname) ? '열 자 이하로 작성해주세요.' : ''
  const newPasswordErrorMessage =
    newPassword && !validatePassword(newPassword) ? '8자 이상 입력해주세요.' : ''
  const newPasswordConfirmationErrorMessage =
    touchedFields.newPasswordConfirmation &&
    newPasswordConfirmation &&
    newPassword !== newPasswordConfirmation
      ? '비밀번호가 일치하지 않습니다.'
      : ''

  const isProfileChanged =
    !!user && (nickname.trim() !== user.nickname || Boolean(selectedImageFile))
  const isProfileSaveDisabled =
    !isProfileChanged || !!nicknameErrorMessage || isSavingProfile || !nickname.trim()

  const isPasswordChangeDisabled =
    !currentPassword.trim() ||
    !newPassword.trim() ||
    !newPasswordConfirmation.trim() ||
    !!newPasswordErrorMessage ||
    !!newPasswordConfirmationErrorMessage ||
    isChangingPassword

  const profileImageSource = previewImageUrl ?? user?.profileImageUrl ?? null

  const handleSelectImage = (file?: File | null) => {
    if (!file) {
      return
    }

    if (previewImageUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewImageUrl)
    }

    setSelectedImageFile(file)
    setPreviewImageUrl(URL.createObjectURL(file))
  }

  const handleSaveProfile = async () => {
    if (!user || isProfileSaveDisabled) {
      return
    }

    setIsSavingProfile(true)

    try {
      let profileImageUrl = user.profileImageUrl

      if (selectedImageFile) {
        const uploadResponse = await uploadMyImage(selectedImageFile)
        profileImageUrl = uploadResponse.profileImageUrl
      }

      await updateMyInfo({
        nickname: nickname.trim(),
        profileImageUrl,
      })
      await refreshUser()
      setSelectedImageFile(null)
      openToast({
        title: '프로필이 저장되었습니다.',
        tone: 'success',
      })
    } catch (error) {
      openToast({
        title: getErrorMessage(error, '프로필 저장에 실패했습니다.'),
        tone: 'error',
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleChangePassword = async () => {
    setTouchedFields({ newPasswordConfirmation: true })

    if (isPasswordChangeDisabled) {
      return
    }

    setIsChangingPassword(true)

    try {
      await changePassword({
        password: currentPassword,
        newPassword,
      })
      setCurrentPassword('')
      setNewPassword('')
      setNewPasswordConfirmation('')
      setTouchedFields({ newPasswordConfirmation: false })
      openToast({
        title: '비밀번호가 변경되었습니다.',
        tone: 'success',
      })
    } catch (error) {
      const message =
        error instanceof ApiError && error.status === 400
          ? '현재 비밀번호가 틀립니다'
          : getErrorMessage(error, '비밀번호 변경에 실패했습니다.')

      openModal({
        actions: [{ label: '확인', tone: 'primary' }],
        title: message,
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const profileCardInitial = useMemo(() => {
    return (nickname.trim() || user?.nickname || 'U').slice(0, 1).toUpperCase()
  }, [nickname, user?.nickname])

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <DashboardHeader />
      <main className="mx-auto flex w-full max-w-[960px] flex-col gap-6 px-4 py-6 md:px-6">
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-taskify-primary-600">
                My Profile
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900">내 정보</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                닉네임과 프로필 이미지를 변경할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
            <article className="flex flex-col items-center gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              {profileImageSource ? (
                <img
                  alt="프로필 이미지"
                  className="size-32 rounded-full object-cover shadow-sm"
                  src={profileImageSource}
                />
              ) : (
                <div className="inline-flex size-32 items-center justify-center rounded-full bg-taskify-primary-600 text-4xl font-bold text-white shadow-sm">
                  {profileCardInitial}
                </div>
              )}
              <input
                accept="image/*"
                className="hidden"
                onChange={(event) => handleSelectImage(event.target.files?.[0] ?? null)}
                ref={fileInputRef}
                type="file"
              />
              <Button onClick={() => fileInputRef.current?.click()} size="sm" variant="outline">
                + 이미지 업로드
              </Button>
              <div className="text-center text-sm text-slate-500">
                <p className="font-semibold text-slate-900">{user?.nickname ?? '사용자'}</p>
                <p className="mt-1">{user?.email ?? '이메일 정보 없음'}</p>
              </div>
            </article>

            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-5">
                <Input
                  errorMessage={nicknameErrorMessage}
                  label="닉네임"
                  onChange={(event) => setNickname(event.target.value)}
                  placeholder="닉네임을 입력해 주세요"
                  value={nickname}
                />
                <Input disabled label="이메일" value={user?.email ?? ''} />
                <div className="flex justify-end">
                  <Button disabled={isProfileSaveDisabled} onClick={handleSaveProfile}>
                    {isSavingProfile ? '저장 중...' : '저장'}
                  </Button>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-taskify-primary-600">
              Password
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">비밀번호 변경</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              현재 비밀번호를 확인한 뒤 새 비밀번호로 변경할 수 있습니다.
            </p>
          </div>

          <div className="mt-6 grid gap-5">
            <Input
              label="현재 비밀번호"
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="현재 비밀번호를 입력해 주세요"
              type="password"
              value={currentPassword}
            />
            <Input
              errorMessage={newPasswordErrorMessage}
              label="새 비밀번호"
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="8자 이상 입력해 주세요"
              type="password"
              value={newPassword}
            />
            <Input
              errorMessage={newPasswordConfirmationErrorMessage}
              label="새 비밀번호 확인"
              onBlur={() =>
                setTouchedFields((prevTouchedFields) => ({
                  ...prevTouchedFields,
                  newPasswordConfirmation: true,
                }))
              }
              onChange={(event) => setNewPasswordConfirmation(event.target.value)}
              placeholder="새 비밀번호를 한 번 더 입력해 주세요"
              type="password"
              value={newPasswordConfirmation}
            />
            <div className="flex justify-end">
              <Button disabled={isPasswordChangeDisabled} onClick={handleChangePassword}>
                {isChangingPassword ? '변경 중...' : '변경'}
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
