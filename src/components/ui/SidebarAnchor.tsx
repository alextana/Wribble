import { MouseEventHandler } from 'react'

function SidebarAnchor({
  extraClass,
  children,
  onClick,
}: {
  extraClass: string
  children: React.ReactNode
  onClick: MouseEventHandler<HTMLDivElement>
}) {
  return (
    <div onClick={onClick} className={`${extraClass}`}>
      {children}
    </div>
  )
}

export default SidebarAnchor
