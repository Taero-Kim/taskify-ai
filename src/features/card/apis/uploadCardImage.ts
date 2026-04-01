import { fetchData } from '@/shared/api/fetch'

type UploadCardImageResponse = {
  imageUrl: string
}

export const uploadCardImage = async (columnId: number, file: File) => {
  const formData = new FormData()
  formData.append('image', file)

  return fetchData<UploadCardImageResponse, FormData>({
    body: formData,
    method: 'POST',
    path: `/columns/${columnId}/card-image`,
    requiresAuth: true,
  })
}
