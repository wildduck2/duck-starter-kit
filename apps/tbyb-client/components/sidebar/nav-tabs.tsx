import { SidebarGroup, SidebarGroupLabel } from '@acme/ui/sidebar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@acme/ui/tabs'
import { NavChats } from './nav-chats'
import { SidebarPrivate } from './nav-clones'

export function NavTabs() {
  const tabClass =
    'p-0 w-full border-b-2 data-[state=active]:border-b-primary data-[state=active]:[&>*]:text-primary !bg-transparent rounded-none !shadow-none'
  return (
    <SidebarGroup className="p-0">
      <Tabs defaultValue="chat">
        <TabsList className="w-full justify-between bg-transparent">
          <TabsTrigger value="chat" className={tabClass}>
            <SidebarGroupLabel>Chat</SidebarGroupLabel>
          </TabsTrigger>
          <TabsTrigger value="clones" className={tabClass}>
            <SidebarGroupLabel>Clones</SidebarGroupLabel>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="p-0">
          <NavChats />
        </TabsContent>
        <TabsContent value="clones" className="p-0">
          <SidebarPrivate />
        </TabsContent>
      </Tabs>
    </SidebarGroup>
  )
}
