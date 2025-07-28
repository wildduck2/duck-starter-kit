'use client'

import { IconCirclePlusFilled, IconMail, type Icon } from '@tabler/icons-react'

import { Button } from '@acme/ui/button'
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@acme/ui/sidebar'
import { Plus } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import Link from 'next/link'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <CreateChatButton />
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function CreateChatButton() {
  return (
    <SidebarMenuItem key={'New Chat'}>
      <SidebarMenuButton tooltip={'New Chat'} asChild>
        <Link href={'/chat'}>
          <Plus />
          <span>New Chat</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

// const { mutate: createChat, isPending } = useMutation({
//   mutationKey: ['createChat'],
//   mutationFn: handleCreateChat,
// })
//
// async function handleCreateChat() {
//   try {
//     const { data } = await axios.post(
//       process.env.NEXT_PUBLIC_API_URL + '/v1/chats/create-chat',
//       {
//         name: 'New Chat',
//         organization_id: '0198330a-0a63-722c-88c7-bd690e912dd3',
//       },
//       {
//         withCredentials: true,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       },
//     )
//
//     return data.data
//   } catch (e) {
//     toast.error('Error creating chat')
//   }
// }
