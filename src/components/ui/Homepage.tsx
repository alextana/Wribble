import React, { useEffect } from 'react'
import { trpc } from 'src/utils/trpc'
import ScribblePreview from './ScribblePreview'
import { useSession } from 'next-auth/react'
import { Scribble } from 'src/types/Scribbles'
import { useAtom } from 'jotai'
import { savedScribbles } from 'src/stores/Scribbles'
export default function Homepage() {
  const [allScribbles, setAllScribbles] = useAtom(savedScribbles)

  const { data: session } = useSession()
  const scribbles = trpc.useQuery(['scribble.getAll'])

  useEffect(() => {
    if (!session) {
      const s = localStorage.getItem('scribbles')
      if (!s) return

      setAllScribbles(JSON.parse(s))
    }

    console.log('sss', session)
  }, [session, setAllScribbles])

  if (!scribbles.data) {
    return <div>Loading...</div>
  }

  return (
    <main className='scribble-select'>
      <h1 className='text-4xl font-extrabold tracking-tighter'>
        Hello! Select your scribble!
      </h1>
      <div className='scribbles grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 space-between md:flex-nowrap my-8'>
        <ScribblePreview isNew={true} />
        {!session ? (
          <>
            {!allScribbles.length ? (
              <>Loading scribbles... </>
            ) : (
              <React.Fragment>
                {allScribbles.map((scribble: Scribble) => (
                  <React.Fragment key={scribble.id}>
                    <ScribblePreview
                      scribble={scribble}
                      title={scribble.title}
                      content={scribble.content}
                      id={scribble.id}
                    />
                  </React.Fragment>
                ))}
              </React.Fragment>
            )}
          </>
        ) : (
          <>
            {!scribbles.data ? (
              <>Loading scribbles...</>
            ) : (
              <React.Fragment>
                {scribbles.data.map((scribble) => (
                  <React.Fragment key={scribble.id}>
                    <ScribblePreview title={scribble.title} id={scribble.id} />
                  </React.Fragment>
                ))}
              </React.Fragment>
            )}
          </>
        )}
      </div>
    </main>
  )
}
