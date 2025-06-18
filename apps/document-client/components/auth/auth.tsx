import { GalleryVerticalEnd } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from './auth.hooks'

export function AuthLayout({ children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="text-primary-foreground flex size-6 items-center justify-center rounded-md overflow-hidden">
              <Image
                src="/placeholder.webp"
                alt="Image"
                width={200}
                height={200}
                className="object-cover dark:brightness-[0.2] dark:grayscale w-[100px] h-[52px]"
              />
            </div>
            <code className="font-bold font-mono">@gentleduck</code>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block ltr:border-l rtl:border-r border-border rtl:order-first">
        <Image
          src="/placeholder.webp"
          alt="Image"
          fill
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
