import {
  currentScribble,
  scribbleTitle,
  toHighlight,
} from 'src/stores/Scribbles'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MdArrowBack } from 'react-icons/md'
import Link from 'next/link'
import SidebarAnchor from '../SidebarAnchor'
import React from 'react'

export default function PageSidebar() {
  const [scribble, setScribbleStore] = useAtom(currentScribble)
  const [title] = useAtom(scribbleTitle)

  const [elements, setElements] = useState<Element[]>([])
  const [, setHighlight] = useAtom(toHighlight)

  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = () => {
      setScribbleStore(null)
    }
    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events, setScribbleStore])

  useEffect(() => {
    if (!scribble) return

    const parser = new DOMParser()
    const parsed = parser.parseFromString(scribble, 'text/html')

    const el: Element[] = Array.from(parsed.body.children)

    setElements(el)
  }, [scribble])

  const handleSidebarClick = (element: Element) => {
    const elId = element.getAttribute('id')
    setHighlight(elId)
  }

  return (
    <aside className='w-[350px] px-3 hidden lg:block h-screen pt-4 sticky top-0'>
      <Link href='/'>
        <div className='title group items-center flex gap-3 cursor-pointer text-gray-800 hover:text-gray-800'>
          <MdArrowBack className='transition-all transform w-6 h-6 group-hover:-translate-x-1' />
          <h2 className='text-md font-bold'>{title}</h2>
        </div>
      </Link>

      {elements.length > 0 && (
        <div className='nav mt-8 text-gray-600'>
          {elements.map((element: Element, i: number) => {
            if (element.tagName === 'H1') {
              return (
                <React.Fragment key={i}>
                  <SidebarAnchor
                    onClick={() => handleSidebarClick(element)}
                    extraClass='chapter text-lg font-bold hover:text-gray-800 cursor-pointer'
                  >
                    {element.textContent}
                  </SidebarAnchor>
                </React.Fragment>
              )
            }

            if (element.tagName === 'H2') {
              return (
                <React.Fragment key={i}>
                  <SidebarAnchor
                    onClick={() => handleSidebarClick(element)}
                    extraClass='ml-4 mt-2 sub-chapter hover:text-gray-800 cursor-pointer'
                  >
                    {element.textContent}
                  </SidebarAnchor>
                </React.Fragment>
              )
            }
          })}
        </div>
      )}
    </aside>
  )
}
