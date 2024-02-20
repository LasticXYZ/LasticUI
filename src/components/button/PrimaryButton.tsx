import Link from 'next/link'
import { FC } from 'react'

interface PrimaryButtonProps {
  title?: string
  location?: string
  onClick?: () => void // Optional click handler
  disabled?: boolean
}

const PrimaryButton: FC<PrimaryButtonProps> = ({
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
        className={`${disabled ? 'bg-gray-2 text-gray-14 cursor-not-allowed': 'bg-pink-3 hover:bg-pink-4 text-black cursor-pointer'} rounded-ful font-unbounded uppercase font-black rounded-2xl   border border-gray-8 text-xs inline-flex items-center justify-center px-12 py-3 mr-3 text-center text-black hover:bg-primary-800 focus:ring-4 focus:ring-primary-3`}
      >
        {title}
      </button>
    )
  } else {
    return (
      <Link
        href={location}
        className="rounded-ful font-unbounded uppercase font-black rounded-2xl bg-pink-3 hover:bg-pink-4 border border-gray-8 text-xs inline-flex items-center justify-center px-12 py-3 mr-3 text-center text-black hover:bg-primary-800 focus:ring-4 focus:ring-primary-3"
      >
        {title}
      </Link>
    )
  }
}

export default PrimaryButton
