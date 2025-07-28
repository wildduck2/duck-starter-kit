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
import { SigninSchemaType, signinSchema } from '~/server/auth/auth.dto'
import { userAtom } from '../auth.atom'
import { PasswordInput } from '../auth.chunks'
import { handleSignin } from './signin.libs'
import { toast } from 'sonner'

export function SigninPage({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter()
  const userAtomSetter = useSetAtom(userAtom)

  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(signinSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const signinMutation = useMutation({
    mutationFn: handleSignin,
    onSuccess: (data) => {
      if (data?.state === 'success') {
        localStorage.setItem('user', JSON.stringify(data.data))
        toast.success('Signed in successfully')
        userAtomSetter(data.data)
        router.push('/')
      }
    },
  })

  const onSubmit = (data: SigninSchemaType) => {
    signinMutation.mutate(data)
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-bold text-2xl">Login to your account</h1>
        <p className="text-balance text-muted-foreground text-sm">Enter your email below to login to your account</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="wilddcuk2" {...field} disabled={signinMutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <FormLabel>Password</FormLabel>
              <Link href="/auth/forgot-password" className="text-sm underline-offset-4 hover:underline">
                Forgot your password?
              </Link>
            </div>
            <PasswordInput form={form} mutation={signinMutation} />
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={!form.formState.isValid || signinMutation.isPending}>
            {signinMutation.isPending && <Loader2 className="size-4 animate-spin" />}
            Login
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
