import Link from 'next/link'

export default function Logo() {
  return (
    <Link href='/'>
      <div className='logo cursor-pointer flex group text-gray-800 hover:text-fuchsia-500 gap-1 items-center'>
        <svg
          className='w-5 h-5'
          viewBox='0 0 205 205'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M68 193H20C17.8783 193 15.8434 192.157 14.3431 190.657C12.8429 189.157 12 187.122 12 185V140.314C12 139.263 12.2069 138.223 12.609 137.252C13.011 136.282 13.6003 135.4 14.3432 134.657L134.343 14.6569C135.843 13.1566 137.878 12.3137 140 12.3137C142.122 12.3137 144.157 13.1566 145.657 14.6569L190.343 59.3432C191.843 60.8434 192.686 62.8783 192.686 65C192.686 67.1217 191.843 69.1566 190.343 70.6569L68 193ZM68 193H188M108 41L164 97M16 133L76 193'
            stroke='#353634'
            strokeWidth='24'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
        <h2 className='text-lg font-light tracking-tighter'>wribble</h2>
      </div>
    </Link>
  )
}
