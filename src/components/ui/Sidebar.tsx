import { useRouter } from 'next/router'
import PageSidebar from './page/PageSidebar'

export default function Sidebar() {
  const router = useRouter()

  if (router.pathname.indexOf('/scribbles/') > -1) {
    return <PageSidebar />
  }

  return (
    <aside className='hidden lg:block w-[40px] h-screen'>
      {/* <h2>home sidebar</h2> */}
    </aside>
  )
}
