'use client'
import { cn } from '@acme/libs/cn'
import { Button } from '@acme/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@acme/ui/form'
import { Input } from '@acme/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { forgotPasswordSchema, forgotPasswordSchemaType } from '~/server/auth/auth.dto'
import { userAtom } from '../auth.atom'
import { handleForgetPassword } from './forgot-password.libs'

export function ForgetPasswordPage() {
  const router = useRouter()
  const userAtomSetter = useSetAtom(userAtom)

  const form = useForm<forgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  })

  const forgetPasswordMutation = useMutation({
    mutationFn: handleForgetPassword,
    onSuccess: (data) => {
      if (data?.state === 'success') {
        localStorage.setItem('user', JSON.stringify(data.data))
        toast.success('Forgot password successfully')
        userAtomSetter(data.data)
        router.push('/auth/verify-code')
      }
    },
  })

  const onSubmit = (data: forgotPasswordSchemaType) => {
    forgetPasswordMutation.mutate(data)
  }

  return (
    <div className={cn('flex flex-col gap-6')}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-bold text-2xl">Forget Password</h1>
        <p className="text-balance text-muted-foreground text-sm">Enter your email to reset your password</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@example.com"
                      {...field}
                      disabled={forgetPasswordMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={!form.formState.isValid || forgetPasswordMutation.isPending}>
            {forgetPasswordMutation.isPending && <Loader2 className="size-4 animate-spin" />}
            Forget password
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </div>
  )
}
