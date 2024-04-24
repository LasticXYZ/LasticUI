import { useEffect, useState } from 'react'

function LoadingSpinner({ isLoading = false }) {
  const [showSpinner, setShowSpinner] = useState(false)

  useEffect(() => {
    let timer
    if (isLoading) {
      setShowSpinner(true) // Immediately show spinner when loading starts
      timer = setTimeout(() => {}, 1200) // Set a dummy timeout to ensure minimum display time
    } else {
      timer = setTimeout(() => {
        setShowSpinner(false) // Hide spinner after a minimum of 1 second
      }, 1200)
    }

    return () => clearTimeout(timer) // Clear the timeout when the component unmounts or isLoading changes
  }, [isLoading])

  if (!showSpinner) {
    return null
  }

  return (
    <div className="border-gray-300 h-3 w-3 animate-spin rounded-full border-2 border-t-lastic-red"></div>
  )
}

export default LoadingSpinner
