import Link from 'next/link';
import { FC } from 'react';

interface SecondaryButtonProps {
  title?: string;
  location?: string;
  onClick?: () => void; // Optional click handler
  disabled?: boolean;
}

const SecondaryButton: FC<SecondaryButtonProps> = ({ title = 'Click me', location = '/', onClick, disabled }) => {
  // If an onClick prop is provided, return a button element. Otherwise, return a Link component.
  if (onClick) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="font-syncopate font-black rounded-2xl hover:bg-pink-3 border border-gray-8 text-xs inline-flex items-center justify-center px-12 py-3 mr-3 text-center text-black hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
      >
        {title}
      </button>
    );
  } else {
    return (
      <Link 
        href={location}           
        className="font-syncopate font-black rounded-2xl hover:bg-pink-3 border border-gray-8 text-xs inline-flex items-center justify-center px-12 py-3 mr-3 text-center text-black hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
      >
        {title}
      </Link>
    );
  }
};

export default SecondaryButton;
