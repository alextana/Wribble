import Logo from '../logo/Logo'
import { useSession } from 'next-auth/react'
import Image from 'next/future/image'
import { HiLogin, HiOutlineLogout } from 'react-icons/hi'
import Link from 'next/link'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className='w-full flex space-between py-2 px-3'>
      <div className='container w-max px-3 md:px-0'>
        <Logo />
      </div>
      <div className='user-info items-center ml-auto flex gap-3'>
        {session ? (
          <>
            {session?.user?.image && (
              <Image
                width='40'
                height='40'
                className='rounded-full'
                src={session.user.image}
                alt={`Photo of ${session?.user?.name}`}
              />
            )}
            {session?.user?.name}
            <Link href='/api/auth/signout'>
              <a className='block logout-button hover:text-purple-500 cursor-pointer'>
                <HiOutlineLogout className='w-6 h-6' />
              </a>
            </Link>
          </>
        ) : (
          <Link href='/api/auth/signin'>
            <button className='btn btn-sm btn-secondary flex gap-3'>
              Login
              <HiLogin />
            </button>
          </Link>
        )}
      </div>
    </header>
  )
}
