import { Label } from '@acme/ui/label'
import { SidebarGroup, SidebarGroupContent, SidebarInput } from '@acme/ui/sidebar'
import { Search } from 'lucide-react'

export function NavSearch() {
  return (
    <SidebarGroup className="py-1">
      <SidebarGroupContent className="relative">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <SidebarInput id="search" placeholder="Search the chats..." className="pl-8" />
        <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2 size-4 select-none opacity-50" />
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
