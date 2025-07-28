'use client'

import { Chat } from '@acme/db/types'
import { cn } from '@acme/libs/cn'
import { Button } from '@acme/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@acme/ui/dropdown-menu'
import { Label } from '@acme/ui/label'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from '@acme/ui/sidebar'
import { IconDots, IconShare3, IconTrash } from '@tabler/icons-react'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { isThisMonth, isThisWeek, isToday, isYesterday } from 'date-fns'
import { Loader, Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'
import { ORGANIZATION_ID } from '../chat'

const FETCH_LIMIT = 40

export function NavChats() {
  const { data, isPending, fetchNextPage, fetchPreviousPage, isFetching, hasNextPage, hasPreviousPage } =
    useInfiniteQuery({
      queryKey: ['chats'],
      queryFn: ({ pageParam = 0 }) => handleGetChats(pageParam),
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < FETCH_LIMIT) return undefined
        return allPages.length
      },
      getPreviousPageParam: (firstPage, allPages) => {
        return allPages.length > 0 ? allPages.length - 2 : undefined
      },
      initialPageParam: 0,
    })

  async function handleGetChats(cursor: number) {
    try {
      const { data } = await axios.get(
        process.env.NEXT_PUBLIC_API_URL +
          '/v1/chats/get-chats' +
          `?organization_id=${ORGANIZATION_ID}&limit=${FETCH_LIMIT}&cursor=${cursor}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (data) {
        return data.data
      }

      return []
    } catch (error) {
      console.log(error)
      // router.push('/auth/signin')
      toast.error('Error getting chats')
      return []
    }
  }

  const _data = data ? Object.values(data.pages).flatMap((item) => item) : []

  function getDateGroupLabel(date: Date) {
    if (isToday(date)) return 'Today'
    if (isYesterday(date)) return 'Yesterday'
    if (isThisWeek(date)) return 'Week'
    if (isThisMonth(date)) return 'Month'
    return 'Previous'
  }

  const groupedChats: Record<string, typeof _data> = {}

  _data.forEach((chat: Chat) => {
    const date = new Date(chat.createdAt!)
    const group = getDateGroupLabel(date)

    if (!groupedChats[group]) {
      groupedChats[group] = []
    }

    groupedChats[group].push(chat)
  })
  // console.log(groupedChats)

  return (
    <>
      <SidebarGroup className="h-[calc(100%-200px)] overflow-x-hidden overflow-y-scroll group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Chats</SidebarGroupLabel>
        <SidebarMenu>
          {_data.length > 0 ? (
            Object.entries(groupedChats).map(([label, chats]) => (
              <div key={label}>
                <Label className="mt-2 px-2 font-semibold text-accent-foreground/80 text-xs">{label}</Label>
                {chats.map((chat) => (
                  <SidebarChatItem key={chat.title} item={chat} />
                ))}
              </div>
            ))
          ) : isPending ? (
            <div className="flex items-center justify-center gap-2">
              <Loader className="h-4 w-4 animate-spin" />
              Loading
            </div>
          ) : (
            <div className="text-center">No Chats</div>
          )}
          {hasNextPage && (
            <SidebarMenuItem>
              <Button className="w-full" variant={'outline'} onClick={() => fetchNextPage()}>
                {isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    Loading
                  </div>
                ) : (
                  <span>Show More</span>
                )}
              </Button>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
        <SidebarRail />
      </SidebarGroup>
    </>
  )
}

export function SidebarChatItem({ item }: { item: Chat }) {
  const { isMobile } = useSidebar()
  const [open, setOpen] = React.useState<boolean>(false)
  const pathname = usePathname()

  return (
    <SidebarMenuSubItem key={item.name}>
      <SidebarMenuSubButton
        isActive={pathname === item.id}
        className={cn('w-full', open || (pathname.includes(item.id as string) && 'bg-secondary/80'))}
        asChild>
        <SidebarMenuItem key={item.name} className="w-full">
          <SidebarMenuButton asChild>
            <Link href={'/chat/' + item.id}>
              <span className="max-w-[225px] truncate">{item.name}</span>
            </Link>
          </SidebarMenuButton>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction showOnHover className="rounded-sm data-[state=open]:bg-secondary/80">
                <IconDots />
                <span className="sr-only">More</span>
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-24 rounded-lg"
              side={isMobile ? 'bottom' : 'right'}
              align={isMobile ? 'end' : 'start'}>
              <DropdownMenuItem>
                <IconShare3 />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <IconTrash />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}
