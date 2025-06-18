import { ResponseType } from '~/server/common/types'
import { toast } from 'sonner'
export function libResponse<T>(error: any): ResponseType<T> {
  const err = error as any
  toast.error(err?.response?.data?.error)
  return {
    state: 'error',
    error: err?.response?.data?.error,
    message: err?.response?.data?.message,
  }
}
