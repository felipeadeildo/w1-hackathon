import { Building2, Coins, Home, LogOut, Settings, Users, type LucideIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '~/components/ui/sidebar'

import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'

import { useAuth } from '~/hooks/use-auth'

interface SidebarItem {
  title: string
  url: string
  icon: LucideIcon
}

const items: SidebarItem[] = [
  { title: 'Dashboard', url: '/app', icon: Home },
  { title: 'Holdings', url: '/app/holdings', icon: Building2 },
  { title: 'Ativos', url: '/app/assets', icon: Coins },
  { title: 'Usuários', url: '/app/users', icon: Users },
  { title: 'Configurações', url: '/app/settings', icon: Settings },
]

export function AppSidebar() {
  const { logout, user } = useAuth()
  const { state } = useSidebar()

  const renderMenuItem = (item: SidebarItem) => (
    <SidebarMenuItem key={item.title}>
      {state === 'collapsed' ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton asChild>
              <a href={item.url} className='flex items-center justify-center w-full'>
                <item.icon className='h-4 w-4' />
              </a>
            </SidebarMenuButton>
          </TooltipTrigger>
          <TooltipContent side='right'>{item.title}</TooltipContent>
        </Tooltip>
      ) : (
        <SidebarMenuButton asChild>
          <a href={item.url} className='flex items-center gap-2'>
            <item.icon className='h-4 w-4' />
            <span>{item.title}</span>
          </a>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  )

  return (
    <div className='relative'>
      <SidebarTrigger floating={true} />
      <Sidebar collapsible='icon'>
        <SidebarHeader>
          <div className='flex items-center justify-center gap-2 px-2 py-2'>
            {state === 'collapsed' ? (
              <img src='/w1.png' alt='W1 Capital' className='h-6 max-w-full' />
            ) : (
              <img src='/w1-tagline.png' alt='W1 Capital' className='h-8 max-w-full' />
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className='overflow-x-hidden'>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{items.map(renderMenuItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Holdings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {[
                  { title: 'Holding XPTO', url: '/app/holding/1' },
                  { title: 'Holding Família Silva', url: '/app/holding/2' },
                  { title: 'Holding Teste', url: '/app/holding/3' },
                ].map((holding) => (
                  <SidebarMenuItem key={holding.title}>
                    {state === 'collapsed' ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton asChild>
                            <a
                              href={holding.url}
                              className='flex items-center justify-center w-full'
                            >
                              <Building2 className='h-4 w-4' />
                            </a>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side='right'>{holding.title}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <SidebarMenuButton asChild>
                        <a href={holding.url} className='flex items-center gap-2'>
                          <Building2 className='h-4 w-4' />
                          <span>{holding.title}</span>
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className='flex flex-col items-center gap-2 px-4 py-2'>
            {state === 'collapsed' ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className='h-8 w-8 cursor-pointer'>
                    <AvatarFallback>
                      <Users className='h-5 w-5' />
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side='right'>{user?.email}</TooltipContent>
              </Tooltip>
            ) : (
              <div className='flex items-center gap-2'>
                <Avatar className='h-8 w-8'>
                  <AvatarFallback>
                    <Users className='h-5 w-5' />
                  </AvatarFallback>
                </Avatar>
                <span className='text-sm truncate'>{user?.email}</span>
              </div>
            )}

            {state === 'collapsed' ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='destructive' size='icon' onClick={logout}>
                    <LogOut className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='right'>Sair</TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant='destructive'
                size='sm'
                className='w-full gap-2 justify-center'
                onClick={logout}
              >
                <LogOut className='h-4 w-4' /> Sair
              </Button>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}
