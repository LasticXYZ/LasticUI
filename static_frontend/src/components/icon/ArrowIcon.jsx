const ArrowIcon = ({ open = false, className="h-5 w-5" }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${
          open ? "rotate-180" : ""
        } transition-transform ${className}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M19 9l-7 7-7-7" />
      </svg>
    );
  }

export default ArrowIcon;