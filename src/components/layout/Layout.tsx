import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Sidebar from '../ui/Sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className='px-3 gap-6 md:px-0 flex w-full'>
        <Sidebar />
        <div className='main-content w-full'>{children}</div>
      </main>
      <Footer />
    </>
  )
}
