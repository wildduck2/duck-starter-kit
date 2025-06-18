'use client'
import { useAtomValue } from 'jotai'
import { userAtom } from './auth.atom'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const userAtomValue = useAtomValue(userAtom)
  const router = useRouter()

  if (!userAtomValue) {
    router.push('/auth/signin')
  }

  return {
    userAtomValue,
  }
}
