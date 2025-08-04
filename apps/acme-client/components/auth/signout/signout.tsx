'use client'
import { IconLogout } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { handleSignout } from './signout.libs'
import { userAtom } from '../auth.atom'
import { useSetAtom } from 'jotai'
import { Button } from '@acme/ui/button'

export function Signout() {
  const router = useRouter()
  const setUser = useSetAtom(userAtom)

  const { mutate } = useMutation({
    mutationFn: handleSignout,
    onSuccess: (data) => {
      if (data?.state === 'success') {
        localStorage.setItem('user', JSON.stringify(''))
        setUser({} as never)
        toast.success('Signed out successfully')
        router.push('/auth/signin')
      }
    },
    onError: (error: Error) => {
      toast.error(error.name)
    },
  })

  return (
    <Button onClick={() => mutate()} variant="ghost" size="sm" className="flex items-center gap-2 justify-start w-full">
      <IconLogout />
      Log out
    </Button>
  )
}
