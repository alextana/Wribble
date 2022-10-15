import { Scribble } from 'src/types/Scribbles'
import { Session } from 'next-auth'
import toast from 'react-hot-toast'

export function randomId(): string {
  if (!window) {
    return ''
  }
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0]

  if (!uint32) {
    return ''
  }
  return uint32?.toString(16)
}

export function getLocalStorage(key: string): Scribble[] {
  const s = localStorage.getItem(key)

  return !s ? null : JSON.parse(s)
}

export function setUpdateLocalStorage(key: string, item: Scribble[]): void {
  localStorage.setItem(key, JSON.stringify(item))
}

// deletes scribbles - checks if the user is logged in
// or not and either deletes from the local storage
// or deletes from the db
// need to check if I can use tRPC from here
export function handleDeleteScribble(
  scribble: Scribble,
  session: Session | null
): Scribble[] | null {
  if (!session) {
    // logged out
    let local = getLocalStorage('scribbles')

    if (!local) {
      console.error('Scribble not found')
      return null
    }

    local = local.filter((f) => f.id !== scribble.id)

    setUpdateLocalStorage('scribbles', local)

    return local
  }

  return null
}

export const saveScribble = (
  key: string,
  session: Session | null,
  content: string,
  id: string | string[]
) => {
  // update local storage
  if (!session) {
    const st = getLocalStorage(key)

    if (!st) {
      setUpdateLocalStorage(key, [
        {
          title: 'New Scribble',
          content: content,
          id: id as string,
          created_at: new Date().toISOString(),
        },
      ])
      return
    }

    let curr = null

    curr = st?.find((f) => f.id === id)

    if (!curr) return

    // don't do anything if the content is the same
    // as what's saved in the local storage
    if (curr.content === content) {
      return
    }

    curr.content = content

    setUpdateLocalStorage(key, st)
    toast.success('Changes successfully saved')

    return
  }
}
