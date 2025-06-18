'use client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/ui/button'
import { Input } from '@gentleduck/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@gentleduck/ui/form'
import { Loader2, Github } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { handleSignup, handleSignupWithGithub } from './signup.libs'
import { signupSchemaClient, SignupSchemaType } from './signup.dto'
import { userAtom } from '../auth.atom'
import { useSetAtom } from 'jotai'
import { toast } from 'sonner'
import { PasswordInput } from '../auth.chunks'

export function SignupPage({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter()
  const userAtomSetter = useSetAtom(userAtom)

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchemaClient),
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  })

  const signupMutation = useMutation({
    mutationFn: handleSignup,
    onSuccess: (data) => {
      if (data?.state === 'success') {
        userAtomSetter(data.data)
        localStorage.setItem('user', JSON.stringify(data.data))
        toast.success('Account created successfully')
        router.push('/dashboard')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create account')
    },
  })

  const githubMutation = useMutation({
    mutationFn: handleSignupWithGithub,
    onError: (error: Error) => {
      toast.error('Failed to sign up with GitHub')
    },
  })

  const onSubmit = (data: SignupSchemaType) => {
    signupMutation.mutate(data)
  }

  const handleGithubSignup = () => {
    githubMutation.mutate()
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground text-sm">Enter your information below to create your account</p>
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
                    <Input type="text" placeholder="wildduck2" {...field} disabled={signupMutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="m@example.com" {...field} disabled={signupMutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <PasswordInput form={form as never} mutation={signupMutation} />

          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      {...field}
                      disabled={signupMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={!form.formState.isValid || signupMutation.isPending}>
            {signupMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>
      </Form>

      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleGithubSignup}
        disabled={!form.formState.isValid || githubMutation.isPending}>
        {githubMutation.isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Github className="mr-2 h-4 w-4" />
        )}
        Sign up with GitHub
      </Button>

      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link href="/auth/signin" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </div>
  )
}
