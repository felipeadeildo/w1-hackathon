import { Outlet } from 'react-router'
import { AppSidebar } from '~/components/app-sidebar'
import { RequiresAuth } from '~/components/requires-auth'
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'

export default function ProtectedLayout() {
  return (
    <RequiresAuth>
      <SidebarProvider>
        <div className='flex min-h-screen bg-background'>
          <AppSidebar />
          <main className='flex-1 px-4 py-8'>
            <SidebarTrigger />
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </RequiresAuth>
  )
}
