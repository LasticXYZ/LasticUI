import Link from 'next/link'
import { FC } from 'react'

interface SecondaryButtonProps {
  title?: string
  location?: string
  onClick?: () => void // Optional click handler
  disabled?: boolean
  className?: string
}

const SecondaryButton: FC<SecondaryButtonProps> = ({
  title = 'Click me',
  location = '/',
  onClick,
  disabled,
  className = '',
}) => {
  const buttonClasses = `font-unbounded uppercase font-black rounded-2xl border text-xs inline-flex items-center justify-center px-12 py-3 mr-3 text-center ${className} ${disabled ? 'bg-gray-1 dark:border-gray-18 border-gray-4 text-gray-6 cursor-not-allowed' : ' hover:bg-pink-400 border-gray-8 text-black dark:text-gray-1 focus:ring-4 focus:ring-primary-3'}`

  // If an onClick prop is provided, return a button element. Otherwise, return a Link component.
  if (onClick) {
    return (
      <button onClick={onClick} disabled={disabled} className={buttonClasses}>
        {title}
      </button>
    )
  } else {
    return (
      <Link href={location} className={buttonClasses}>
        {title}
      </Link>
    )
  }
}

export default SecondaryButton
