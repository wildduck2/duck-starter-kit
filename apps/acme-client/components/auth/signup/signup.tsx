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
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { userAtom } from '../auth.atom'
import { PasswordInput } from '../auth.chunks'
import { SignupSchemaType, signupSchemaClient } from './signup.dto'
import { handleSignup } from './signup.libs'

export function SignupPage({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter()
  const userAtomSetter = useSetAtom(userAtom)

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchemaClient),
    mode: 'onChange',
    defaultValues: {
      name: '',
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
        toast.success('Signed up successfully')
        router.push('/')
      }
    },
  })

  const onSubmit = (data: SignupSchemaType) => {
    signupMutation.mutate(data)
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-bold text-2xl">Create your account</h1>
        <p className="text-muted-foreground text-sm">Enter your information below to create your account</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="John Doe" {...field} disabled={signupMutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="johndoe" {...field} disabled={signupMutation.isPending} />
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
                    <Input
                      type="email"
                      placeholder="Rb1m1@example.com"
                      {...field}
                      disabled={signupMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-2">
            <FormLabel>Password</FormLabel>
            <PasswordInput form={form} mutation={signupMutation} />
          </div>

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

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={signupMutation.isPending || !form.formState.isValid}>
            {signupMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link href="/auth/signin" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </div>
  )
}

// <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
//   <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
// </div>
//
// <Button variant="outline" className="w-full" onClick={handleGithubSignup} disabled={githubMutation.isPending}>
//   {githubMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
//   Sign up with Google
// </Button>
