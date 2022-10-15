import { createRouter } from './context'
import { z } from 'zod'

export const scribbleRoute = createRouter()
  .query('getAll', {
    async resolve({ ctx }) {
      return await ctx.prisma.scribble.findMany()
    },
  })
  .query('getScribbles', {
    async resolve({ ctx }) {
      try {
        return await ctx.prisma.scribble.findMany()
      } catch (error) {
        console.error(error)
      }
    },
  })
// .mutation('createScribble', {
//   input: z.object({
//     title: z.string(),
//     userId: z.string(),
//   }),
//   async resolve({ ctx }) {
//     ctx.prisma.scribble.create()
//   },
// })
