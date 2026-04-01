import { fetchData } from '@/shared/api/fetch'

type UploadMyImageResponse = {
  profileImageUrl: string
}

export const uploadMyImage = async (file: File) => {
  const formData = new FormData()
  formData.append('image', file)

  return fetchData<UploadMyImageResponse, FormData>({
    body: formData,
    method: 'POST',
    path: '/users/me/image',
    requiresAuth: true,
  })
}
