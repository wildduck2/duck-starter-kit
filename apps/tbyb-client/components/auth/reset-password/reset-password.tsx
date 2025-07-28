'use client'
import { cn } from '@acme/libs/cn'
import { Button } from '@acme/ui/button'
import { Form, FormLabel } from '@acme/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ResetPasswordSchemaType, resetPasswordSchema } from '~/server/auth/auth.dto'
import { userAtom } from '../auth.atom'
import { PasswordInput } from '../auth.chunks'
import { handleResetPassword } from './reset-password.libs'

export function ResetPasswordPage() {
  const router = useRouter()
  const user = useAtomValue(userAtom)

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      user_id: String(user?.id),
      password: '',
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: handleResetPassword,
    onSuccess: (data) => {
      if (data?.state === 'success') {
        toast.success('Forgot password successfully')
        router.push('/auth/signin')
      }
    },
  })

  const onSubmit = (data: ResetPasswordSchemaType) => {
    resetPasswordMutation.mutate(data)
  }

  return (
    <div className={cn('flex flex-col gap-6')}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-bold text-2xl">Reset Password</h1>
        <p className="text-balance text-muted-foreground text-sm">Enter your password down below to reset</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <FormLabel>Password</FormLabel>
            <PasswordInput form={form} mutation={resetPasswordMutation} />
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={!form.formState.isValid || resetPasswordMutation.isPending}>
            {resetPasswordMutation.isPending && <Loader2 className="size-4 animate-spin" />}
            Reset Password
          </Button>
        </form>
      </Form>
    </div>
  )
}
