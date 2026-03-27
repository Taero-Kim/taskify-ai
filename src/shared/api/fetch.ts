import { clearAccessToken, getAccessToken } from '@/features/auth/apis/authStorage'
import { API_BASE_URL, API_TEAM_ID } from '@/shared/constants/api'

type QueryPrimitive = string | number | boolean
type QueryValue = QueryPrimitive | null | undefined
type QueryParams = Record<string, QueryValue | QueryValue[]>
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type FetchOptions<TBody> = {
  body?: TBody
  headers?: HeadersInit
  method?: HttpMethod
  path: string
  query?: QueryParams
  requiresAuth?: boolean
  signal?: AbortSignal
  skipTeamPath?: boolean
}

let unauthorizedHandler: (() => void) | null = null

export class ApiError extends Error {
  payload: unknown
  status: number

  constructor(status: number, message: string, payload: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

const appendQueryParams = (url: URL, query?: QueryParams) => {
  if (!query) {
    return
  }

  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item === undefined || item === null) {
          return
        }

        url.searchParams.append(key, String(item))
      })

      continue
    }

    if (value === undefined || value === null) {
      continue
    }

    url.searchParams.set(key, String(value))
  }
}

const buildRequestUrl = (path: string, skipTeamPath?: boolean) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const prefixedPath = skipTeamPath ? normalizedPath : `/${API_TEAM_ID}${normalizedPath}`
  const url = new URL(prefixedPath, `${API_BASE_URL}/`)

  return url
}

const parseResponsePayload = async (response: Response) => {
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()

  return text || null
}

const getErrorMessage = (payload: unknown, fallbackMessage: string) => {
  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }

  if (
    payload &&
    typeof payload === 'object' &&
    'message' in payload &&
    typeof payload.message === 'string' &&
    payload.message.trim()
  ) {
    return payload.message
  }

  return fallbackMessage
}

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler
}

export const fetchData = async <TResponse, TBody = unknown>({
  body,
  headers,
  method = 'GET',
  path,
  query,
  requiresAuth = false,
  signal,
  skipTeamPath = false,
}: FetchOptions<TBody>) => {
  const requestUrl = buildRequestUrl(path, skipTeamPath)
  const requestHeaders = new Headers(headers)

  appendQueryParams(requestUrl, query)

  if (requiresAuth) {
    const accessToken = getAccessToken()

    if (!accessToken) {
      unauthorizedHandler?.()
      throw new ApiError(401, '로그인이 필요합니다.', { message: '로그인이 필요합니다.' })
    }

    requestHeaders.set('Authorization', `Bearer ${accessToken}`)
  }

  const requestInit: RequestInit = {
    headers: requestHeaders,
    method,
    signal,
  }

  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      requestInit.body = body
    } else {
      requestHeaders.set('Content-Type', 'application/json')
      requestInit.body = JSON.stringify(body)
    }
  }

  const response = await fetch(requestUrl, requestInit)
  const payload = await parseResponsePayload(response)

  if (!response.ok) {
    if (response.status === 401) {
      clearAccessToken()
      unauthorizedHandler?.()
    }

    throw new ApiError(
      response.status,
      getErrorMessage(payload, '요청 처리에 실패했습니다.'),
      payload,
    )
  }

  return payload as TResponse
}
