import { ACCESS_TOKEN_STORAGE_KEY } from '@/shared/constants/storage'

const isBrowser = typeof window !== 'undefined'

export const getAccessToken = () => {
  if (!isBrowser) {
    return null
  }

  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
}

export const setAccessToken = (accessToken: string) => {
  if (!isBrowser) {
    return
  }

  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken)
}

export const clearAccessToken = () => {
  if (!isBrowser) {
    return
  }

  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
}
