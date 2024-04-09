import Link from 'next/link'
import { FC } from 'react'

export interface PrimaryButtonProps {
  title?: string
  location?: string
  onClick?: () => void // Optional click handler
  disabled?: boolean
}

const PrimaryButtonWeb: FC<PrimaryButtonProps> = ({
  title = 'Click me',
  location = '/',
  onClick,
  disabled,
}) => {
  // If an onClick prop is provided, return a button element. Otherwise, return a Link component.
  if (onClick) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${disabled ? 'bg-gray-2 text-gray-14 cursor-not-allowed' : ' bg-gradient-to-r from-purple-4 to-primary-5  hover:bg-pink-4 text-white cursor-pointer'} rounded-ful font-syne font-black rounded-2xl   border border-gray-8 text-xs inline-flex items-center justify-center px-12 py-3 mr-3 text-center text-black hover:bg-primary-800 focus:ring-4 focus:ring-primary-3`}
      >
        {title}
      </button>
    )
  } else {
    return (
      <Link
        href={location}
        className="rounded-ful font-syne font-black rounded-2xl bg-gradient-to-r from-pink-4 to-purple-5 hover:from-pink-5 hover:to-purple-6 border border-gray-16 text-md inline-flex items-center justify-center px-12 py-3 mr-3 text-center text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-3"
      >
        {title}
      </Link>
    )
  }
}

export default PrimaryButtonWeb
