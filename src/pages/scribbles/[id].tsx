import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import type { Scribble } from 'src/types/Scribbles'
import { useEffect, useState } from 'react'
import Page from 'src/components/ui/page/Page'
import 'react-quill/dist/quill.snow.css'

export default function ScribbleId() {
  const [scribble, setScribble] = useState<Scribble | null>(null)
  const { data: session } = useSession()
  const router = useRouter()
  const { id } = router.query

  // not logged in
  useEffect(() => {
    if (!session) {
      const localScribbles = localStorage.getItem('scribbles')

      if (localScribbles) {
        const parsed = JSON.parse(localScribbles)

        if (!scribble) {
          setScribble(parsed.find((f: Scribble) => f.id === id))
        }
      }
    }
  }, [session, id, scribble])

  // you'd only have a scribble if the user is not
  // logged in and the scribble exists

  if (scribble && !session) {
    // get scribble from local storage
    return <Page id={id} />
  }

  return <div>logged in scribble here, get from db</div>
}
