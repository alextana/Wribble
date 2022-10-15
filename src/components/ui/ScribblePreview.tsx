import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { handleDeleteScribble, randomId } from 'src/utils/utils'
import { useRouter } from 'next/router'
import { Scribble } from 'src/types/Scribbles'
import React, { useState } from 'react'
import { savedScribbles } from 'src/stores/Scribbles'
import { useAtom } from 'jotai'
import toast from 'react-hot-toast'
import { HiOutlineTrash, HiOutlinePlusCircle } from 'react-icons/hi'

export default function ScribblePreview({
  title,
  id,
  isNew,
  content,
  scribble,
}: {
  title?: string
  id?: string
  isNew?: boolean
  content?: string
  scribble?: Scribble
}) {
  const [hoverState, setHoverState] = useState<'enter' | 'leave'>('leave')
  const [, setAllScribbles] = useAtom(savedScribbles)
  const { data: session } = useSession()
  const router = useRouter()

  const scribbleClass =
    'transition-all border hover:shadow-2xl p-4 transform hover:scale-[1.01] cursor-pointer bg-white border-gray-400 w-full h-[270px]'

  const createScribble = (status: 'logged-in' | 'logged-out') => {
    if (status === 'logged-in') {
      // do logged in code here
      return
    }
    // either save in local storage or db
    // based on login state
    const localScribbles = localStorage.getItem('scribbles')
    // not logged in and no local storage
    if (localScribbles) {
      const parsed = JSON.parse(localScribbles)
      const newScribble = {
        id: randomId(),
        title: 'New Scribble',
        content: '',
        created_at: new Date().toISOString(),
      }

      parsed.push(newScribble)
      localStorage.setItem('scribbles', JSON.stringify(parsed))

      router.push(`/scribbles/${newScribble.id}`)
      return
    }

    const scribbles = [
      {
        id: randomId(),
        title: 'New Scribble',
        content: '',
        created_at: new Date().toISOString(),
      },
    ]

    localStorage.setItem('scribbles', JSON.stringify(scribbles))
    router.push(`/scribbles/${scribbles[0]?.id}`)
  }

  const handleDelete = (
    e: React.MouseEvent<HTMLElement>,
    scribble: Scribble
  ) => {
    e.preventDefault()
    e.stopPropagation()

    const updated = handleDeleteScribble(scribble, session)

    // always wrong so return with error notif
    if (!updated) {
      toast.error('Could not delete this scribble')

      console.error('Something went wrong')
      return
    }

    // logged out so update scribbles atom state
    if (!session) {
      setAllScribbles(updated)
      // TODO - success notification
      toast.success('Scribble deleted!')
      return
    }

    // TODO - logged in, probably just need to respond to mutation
  }

  if (isNew) {
    return (
      <div
        onClick={() =>
          createScribble(`${session ? 'logged-in' : 'logged-out'}`)
        }
        className={`${scribbleClass} grid place-content-center text-center`}
      >
        <HiOutlinePlusCircle className='w-12 h-12 mx-auto' />

        <h2 className='font-bold text-2xl'>{title || 'Create new'}</h2>
      </div>
    )
  }
  return (
    <Link href={`/scribbles/${id}`}>
      <div
        onMouseEnter={() => setHoverState('enter')}
        onMouseLeave={() => setHoverState('leave')}
        className={`${scribbleClass} overflow-hidden`}
      >
        {hoverState === 'enter' && scribble && (
          <div
            onClick={(e) => {
              handleDelete(e, scribble)
            }}
            className='absolute  bottom-2 right-2 z-[100] bg-gray-400 hover:bg-gray-600 text-white rounded-full p-2 grid place-content-center'
          >
            <HiOutlineTrash className='w-6 h-6' />
          </div>
        )}
        <h2 className='font-bold text-xl mb-2'>{title || 'Blank'} </h2>
        <div className='overlay absolute bottom-0 h-[120px] bg-gradient-to-t from-white to-transparent z-50 w-full'></div>
        {content && (
          <div className='content text-sm '>
            <span dangerouslySetInnerHTML={{ __html: content }}></span>
          </div>
        )}
      </div>
    </Link>
  )
}
