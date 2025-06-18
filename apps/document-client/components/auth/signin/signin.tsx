'use client'
import Link from 'next/link'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/ui/button'
import { Input } from '@gentleduck/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@gentleduck/ui/form'
import { Loader2, Github, EyeOff, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { handleSignin, handleSigninWithGithub } from './signin.libs'
import { signinSchema } from '~/server/auth/auth.dto'
import { SigninSchemaType } from '~/server/auth/auth.types'
import { userAtom } from '../auth.atom'
import { useSetAtom } from 'jotai'
import { toast } from 'sonner'
import React from 'react'
import { ResponseType } from '~/server/common/types'
import { User } from '~/server/auth/schema/user.schema'
import { PasswordInput } from '../auth.chunks'

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
        userAtomSetter(data.data)
        toast.success('Signed in successfully')
        router.push('/')
      }
    },
    onError: (error: Error) => {
      toast.error(error.name)
    },
  })

  const githubMutation = useMutation({
    mutationFn: handleSigninWithGithub,
    onError: (error: Error) => {},
  })

  const onSubmit = (data: SigninSchemaType) => {
    signinMutation.mutate(data)
  }

  const handleGithubSignin = () => {
    githubMutation.mutate()
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">Enter your email below to login to your account</p>
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
          <PasswordInput form={form} mutation={signinMutation} />

          <Button type="submit" className="w-full" disabled={!form.formState.isValid || githubMutation.isPending}>
            {signinMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </form>
      </Form>

      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleGithubSignin}
        disabled={!form.formState.isValid || githubMutation.isPending}>
        {githubMutation.isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Github className="mr-2 h-4 w-4" />
        )}
        Login with GitHub
      </Button>

      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </div>
  )
}
