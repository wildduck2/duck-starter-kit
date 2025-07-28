'use client'

import { IconFolder, IconUsers } from '@tabler/icons-react'

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem } from '@acme/ui/sidebar'
import { NavMain } from './nav-main'
import { Logo } from '../common/logo'
import { ProjectSwitcher } from './project-switchers'
import { NavTabs } from './nav-tabs'
import { NavSearch } from './nav-search'
import { TechnologiesSwitcher } from './tech-switcher'

export const data = {
  user: {
    name: 'Wildduck',
    email: 'wildduck@iusevimbtw.com',
    avatar: 'https://avatars.githubusercontent.com/u/108896341',
  },
  navMain: [
    {
      title: 'Projects',
      url: '#',
      icon: IconFolder,
    },
    {
      title: 'Team',
      url: '#',
      icon: IconUsers,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Logo />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSearch />
        <ProjectSwitcher />
        <NavTabs />
      </SidebarContent>
      <SidebarFooter className="absolute right-0 bottom-0 left-0 bg-sidebar">
        <TechnologiesSwitcher />
      </SidebarFooter>
    </Sidebar>
  )
}

// <NavSecondary items={data.navSecondary} className="mt-auto" />
