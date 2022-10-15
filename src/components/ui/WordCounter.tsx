import { useEffect, useState } from 'react'

export default function WordCounter({ wordContent }: { wordContent: string }) {
  const [wordCount, setWordCount] = useState<number>(0)

  // count words
  useEffect(() => {
    if (!wordContent.length) {
      setWordCount(0)
    }
    const splitContent = wordContent.trim().split(/\s+/)
    if (splitContent.length === 1 && splitContent[0] === '') {
      setWordCount(0)
    } else {
      setWordCount(splitContent.length)
    }
  }, [wordContent])

  return (
    <div className='font-mono text-sm mt-4 flex gap-3 items-center'>
      <span>Words: {wordCount}</span>
      <span>Characters: {wordContent.length}</span>
    </div>
  )
}
