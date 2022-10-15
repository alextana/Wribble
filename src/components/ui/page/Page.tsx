import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import {
  getLocalStorage,
  saveScribble,
  setUpdateLocalStorage,
} from 'src/utils/utils'
import { Scribble } from 'src/types/Scribbles'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import {
  currentScribble,
  scribbleTitle,
  toHighlight,
} from 'src/stores/Scribbles'
import { HeadingOne, HeadingTwo } from 'src/quill-modifiers/Headings'

export default function Page({ id }: { id?: string | string[] }) {
  const ReactQuill =
    typeof window === 'object' ? require('react-quill') : () => false
  const router = useRouter()
  const isMounted = useRef(false)
  const quillContainer = useRef(null)
  const { data: session } = useSession()

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false)
  const [pageContent, setPageContent] = useState<string>('')
  // initial used for comparison
  const [initialPageContent, setInitialPageContent] = useState<string>('')
  const [highlight] = useAtom(toHighlight)
  const [, setScribbleTitle] = useAtom(scribbleTitle)
  const [, setScribbleStore] = useAtom(currentScribble)

  const Quill = ReactQuill.Quill

  const [scribble, setScribble] = useState<Scribble>({
    title: 'New Scribble',
    id: id as string,
    content: '',
    created_at: new Date().toISOString(),
  })

  /* Add random IDs for the headings for further use */
  HeadingOne.blotName = 'headings-1'
  HeadingOne.tagName = 'H1'
  Quill.register('formats/block', HeadingOne, 'suppressWarning')

  HeadingTwo.blotName = 'headings-2'
  HeadingTwo.tagName = 'H2'

  Quill.register('formats/block', HeadingTwo, 'suppressWarning')
  /* END Quill adding ids */

  // save state on route change
  useEffect(() => {
    const handleRouteChange = () => {
      // compare page content to initial

      const initial = JSON.stringify(initialPageContent)
      const current = JSON.stringify(pageContent)

      if (initial === current) {
        saveScribble('scribbles', session, pageContent, id as string)
      }
    }
    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events, id, pageContent, session, initialPageContent])

  // get initial data on first load
  useEffect(() => {
    if (!session && !isMounted.current) {
      const h = getLocalStorage('scribbles')

      if (!h) return
      let s = null

      if (Array.isArray(h)) {
        s = h.find((f) => f.id === id)
      }

      if (!s) return

      setScribble(s)
      setScribbleTitle(s.title)
      setInitialPageContent(s.content)
      setPageContent(s.content)
      isMounted.current = true
    }
  }, [id, session, setScribbleTitle])

  useEffect(() => {
    setScribbleStore(pageContent)
  }, [pageContent, setScribbleStore])

  useEffect(() => {
    const toScroll = document.getElementById(highlight as string)
    toScroll?.scrollIntoView()
    window.scrollBy(0, -50)
  }, [highlight])

  const handleTitleUpdate = (value: string) => {
    // only update local storage for now
    const local = getLocalStorage('scribbles')

    if (!local) return

    const curr = local.find((f) => f.id === id)

    if (!curr || curr.title === value) {
      setIsEditingTitle(false)
      return
    }

    curr.title = value

    try {
      setUpdateLocalStorage('scribbles', local)
    } catch (error) {
      console.error(error)
    }

    setScribble((prevState: Scribble) => ({
      ...prevState,
      title: curr.title,
    }))
  }

  const handleSave = () => {
    saveScribble('scribbles', session, pageContent, id as string)
    const newScribble = {
      ...scribble,
      content: pageContent,
    }
    setScribble(newScribble)
    setScribbleStore(newScribble.content)
  }

  return (
    <>
      {!isEditingTitle ? (
        <div onClick={() => setIsEditingTitle(true)}>
          <h1 className='text-4xl font-extrabold tracking-tighter mb-4'>
            {scribble?.title}
          </h1>
        </div>
      ) : (
        <input
          type='text'
          className='text-4xl w-max font-extrabold bg-transparent tracking-tighter mb-4 appearance-none'
          autoFocus
          defaultValue={scribble.title}
          onChange={(e) => handleTitleUpdate(e.target.value)}
          onBlur={() => setIsEditingTitle(false)}
        />
      )}
      <div ref={quillContainer} className='quill-container'>
        <ReactQuill
          className='shadow-2xl'
          theme='snow'
          value={pageContent}
          onBlur={handleSave}
          onChange={setPageContent}
        />
      </div>
    </>
  )
}
