// 'use client'
import { SidebarInset, SidebarProvider } from '@acme/ui/sidebar'
import React from 'react'
import { useAuth } from '~/components/auth/auth.hooks'

import { AppSidebar } from '~/components/sidebar/sidebar'
import { SiteHeader } from '~/components/sidebar/site-header'
import { redirect } from 'next/navigation'

export default function Page() {
  // const [myCookie, setMyCookie] = React.useState<string>('')
  //
  // const router = useRouter()
  // const {} = useAuth()
  // React.useEffect(() => {
  //   const cookies = document.cookie
  //     .split('; ')
  //     .find((row) => row.startsWith('myCookieName='))
  //     ?.split('=')[1]
  //
  //   setMyCookie(cookies ?? '')
  // }, [])

  // console.log(myCookie)

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 74)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6"></div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
