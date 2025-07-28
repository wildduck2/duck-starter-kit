import { cn } from '@acme/libs/cn'
import { Avatar, AvatarFallback, AvatarImage } from '@acme/ui/avatar'
import { Button, buttonVariants } from '@acme/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@acme/ui/dropdown-menu'
import { SidebarMenu } from '@acme/ui/sidebar'
import { Archive, Ellipsis, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export function SidebarPrivate() {
  return (
    <SidebarMenu className="gap-0 px-2">
      {characters.map((char) => (
        <SidebarPrivateItem key={char.name} char={char} />
      ))}
    </SidebarMenu>
  )
}

export function SidebarPrivateItem({ char }: { char: (typeof characters)[number] }) {
  const isMobile = false
  const [open, setOpen] = React.useState<boolean>(false)

  return (
    <Link
      href={`/clone/${char.id}`}
      key={char.name}
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'sm' }),
        'justify-start h-auto py-2 relative hover:[&>[data-menu]]:opacity-100',
        open && 'bg-muted/50',
      )}>
      <Avatar className="rounded-lg !size-8">
        <AvatarImage src={char.img} alt={char.name} className="size-8" />
        <AvatarFallback>{char.name[0]}</AvatarFallback>
      </Avatar>
      <span className="truncate">{char.name}</span>

      <DropdownMenu onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn('absolute top-1 right-1 opacity-0 transition-opacity', open && 'opacity-100')}
            data-menu="">
            <Ellipsis />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[150px] rounded-lg"
          side={isMobile ? 'bottom' : 'right'}
          align={isMobile ? 'end' : 'start'}>
          <DropdownMenuItem>
            <Archive />
            <span>Archive</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="">
            <Trash2 />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Link>
  )
}

export const characters = [
  {
    id: '4afc9e50-9a0e-422c-9db9-b446d077bef1',
    name: 'Ahmed Ayob',
    img: 'https://cdn.discordapp.com/avatars/909037612466065428/7fb9dcd82867162b984e8dfac328feec.webp',
  },
  {
    id: '4afc9e50-9a0e-422c-9db9-b446d077be21',
    name: 'Andres Toro',
    img: 'https://cdn.discordapp.com/avatars/691426853323538462/8a8f9331f6e96253884bd203a954d8e0.webp',
  },
  {
    id: '2cfda14d-c235-48d0-806e-1ee9752abeb7',
    name: 'Magalí Matamala',
    img: 'https://cdn.discordapp.com/avatars/950559801597915196/9e513893d8ef2fc1f83ea724a3055c81.webp',
  },
  {
    id: '1f83ce46-3878-4751-a736-ab0666022503',
    name: 'Princess Bubblegum',
    img: 'https://react-beautiful-dnd.netlify.app/static/media/princess-min.34218e29.png',
  },
  {
    id: 'd9c06be4-b633-4dbe-9061-bf378c997a11',
    name: 'BMO',
    img: 'https://react-beautiful-dnd.netlify.app/static/media/bmo-min.9c65ecdf.png',
  },
  {
    id: 'e5f994c0-26eb-4a04-ac27-63a4fd0ed355',
    name: 'Jake',
    img: 'https://react-beautiful-dnd.netlify.app/static/media/jake-min.cc34aede.png',
  },
  {
    id: 'fb4b7d37-4826-4839-8629-f2f6fde163c9',
    name: 'Finn',
    img: 'https://react-beautiful-dnd.netlify.app/static/media/finn-min.0a5700c4.png',
  },
  {
    id: 'uuid',
    name: 'Princess Bubblegum',
    img: 'https://react-beautiful-dnd.netlify.app/static/media/princess-min.34218e29.png',
  },
]
