import { Button } from '@acme/ui/button'
import { Separator } from '@acme/ui/separator'
import { SidebarTrigger } from '@acme/ui/sidebar'
import { Github } from 'lucide-react'
import Link from 'next/link'
import { NavUser } from './nav-user'
import { data } from './sidebar'

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        {
          // <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          //   <h1 className="font-medium text-base">How to resolve the issue with Arch Linux...</h1>
        }
        <div className="ml-auto flex items-center gap-2">
          <NavUser user={data.user} />
        </div>
      </div>
    </header>
  )
}
