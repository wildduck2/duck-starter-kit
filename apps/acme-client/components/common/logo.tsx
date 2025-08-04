import { cn } from '@acme/libs/cn'
import Image from 'next/image'
import Link from 'next/link'

export function Logo({ className, href = '/', ...props }: Partial<React.ComponentProps<typeof Link>>) {
  return (
    <Link href={href} className={cn('flex items-center gap-2 font-medium', className)} {...props}>
      <Image src="/acme.svg" alt="Image" width={200} height={200} className="h-[38px] w-[40px] object-contain" />
    </Link>
  )
}
