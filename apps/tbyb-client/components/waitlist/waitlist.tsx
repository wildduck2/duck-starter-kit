'use client'

import { Badge } from '@acme/ui/badge'
import { Button } from '@acme/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@acme/ui/form'
import { Input } from '@acme/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Crown, PenTool } from 'lucide-react'
import { AnimatePresence, domAnimation, LazyMotion } from 'motion/react'
import * as motion from 'motion/react-m' // minified version
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { APP_API } from '~/types/api'
import { WaitlistFormSchemaType, waitlistFormSchema } from './waitlist.dto'
import { Avatar, AvatarFallback, AvatarImage } from '@acme/ui/avatar'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from '@acme/ui/dialog'
import { Label } from '@acme/ui/label'

function HeroTitle({ options }: { options: string[] }) {
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % options.length), 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <h1 className="text-center font-bold text-6xl text-primary leading-22 max-lg:text-5xl max-lg:leading-12 max-xl:text-5xl gap-8 overflow-hidden h-fit">
      Collaborate Effortlessly With Your
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={options[index]}
          className="inline-flex h-auto overflow-hidden text-acme-blue ltr:ml-6 rtl:mr-6"
          layout
          initial={{ y: '50%', opacity: 0 }}
          exit={{ y: '-50%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}>
          {options[index]}
        </motion.span>
      </AnimatePresence>
    </h1>
  )
}

export function WaitlistPage() {
  return (
    <div className="grid min-h-svh">
      <div className="flex flex-col gap-8 p-6 md:p-10">
        <div className="fixed top-4 left-8 flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex items-center justify-center overflow-hidden rounded-md text-primary-foreground">
              <Image
                src="/acme.svg"
                alt="Image"
                width={200}
                height={200}
                className="h-[42px] w-[50px] object-contain"
              />
            </div>
            <code className="font-bold font-mono"></code>
          </Link>
        </div>
        <div className="mt-[200px] flex flex-col items-center justify-center gap-4">
          <div className="mb-2 flex flex-col gap-2">
            <LazyMotion features={domAnimation}>
              <HeroTitle options={['Clone', 'Tools', 'Team']} />
            </LazyMotion>

            <p className="mx-auto w-[900px] flex-wrap text-center text-muted-foreground text-xl">
              <span className="font-bold text-acme-blue">acme</span> is where humans, clones, and AI agents work side by
              side. Clone yourself. Automate what you hate. Use your favorite tools. Build with anyone - real or
              fictional. We’re opening early access. Want in?
            </p>
          </div>

          <WaitlistForm />

          <div className="flex items-center gap-4">
            <div className="-space-x-2 flex *:data-[slot=avatar]:size-10 *:data-[slot=avatar]:border-2">
              <Avatar>
                <AvatarImage
                  src="https://cdn.discordapp.com/avatars/691426853323538462/8a8f9331f6e96253884bd203a954d8e0.webp?size=160"
                  alt="@race"
                />
                <AvatarFallback>R</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage
                  src="https://cdn.discordapp.com/avatars/909037612466065428/7fb9dcd82867162b984e8dfac328feec.webp?size=40"
                  alt="@ahmed"
                />
                <AvatarFallback>AA</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage
                  src="https://cdn.discordapp.com/avatars/950559801597915196/9e513893d8ef2fc1f83ea724a3055c81.webp?size=100"
                  alt="@evilrabbit"
                />
                <AvatarFallback>MG</AvatarFallback>
              </Avatar>
            </div>
            <span className="text-muted-foreground font-medium">Trusted by 1,000+ early adopters</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function WaitlistForm() {
  const [open, setOpen] = React.useState<boolean>(false)
  const form = useForm<WaitlistFormSchemaType>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      email: '',
    },
  })

  const { mutate } = useMutation({
    mutationFn: async (data: APP_API['addToWishlist']['args']) => {
      const promise = axios.post(process.env.NEXT_PUBLIC_API_URL + '/v1/waitlist/add', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      toast.promise(promise, {
        loading: 'Adding to waitlist ...',
        success: 'Added to waitlist successfully',
        error: 'Error adding to waitlist',
      })

      promise.then(() => {
        form.reset()
        setOpen(true)
      })
    },
  })

  function onSubmit(values: WaitlistFormSchemaType) {
    mutate(values)
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-[70px] items-start gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter your e-mail"
                      className="h-[55px] w-[500px] rounded-full pl-6 font-semibold text-lg placeholder:font-medium placeholder:text-lg"
                      {...field}
                      type="email"
                    />
                    <Button
                      type="submit"
                      className="-translate-y-1/2 absolute top-1/2 right-1.5 cursor-pointer rounded-full bg-acme-blue font-medium text-lg hover:bg-acme-blue/80"
                      size={'lg'}>
                      Subscribe
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-center font-medium text-md" />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join the acme Discord Community</DialogTitle>
            <DialogDescription>
              Be part of our private space for early adopters. Get first access to cloning and collaboration
              capabilities, platform updates, early features, and exclusive behind-the-scenes content.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-between">
            <DialogClose asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </DialogClose>
            <Button asChild>
              <Link href="https://discord.gg/JeQXkb3K" target="_blank" className="w-full">
                Join Now
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
