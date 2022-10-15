import { atom } from 'jotai'
import { Scribble } from 'src/types/Scribbles'

// playlist track
export const savedScribbles = atom<Scribble[]>([])
export const currentScribble = atom<string | null>(null)
export const scribbleTitle = atom<string | null>(null)

export const toHighlight = atom<string | null>('')
