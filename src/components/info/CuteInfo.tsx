import React from 'react'

type ConstInfoProps = {
  message: string
  emoji: string
  color?: string
}

const CuteInfo: React.FC<ConstInfoProps> = ({
  message,
  emoji,
  color = 'bg-teal-4 dark:bg-teal-7',
}) => {
  return (
    <>
      <div className="relative w-24 h-24 rounded-full flex items-center justify-center">
        <div
          className={`${color} absolute z-20 w-16 h-16 blur-md backdrop-filter-blur bg-opacity-80 rounded-full flex items-center justify-center`}
        ></div>
        <div
          className={`absolute z-30 w-16 h-16 border border-gray-9 ${color} backdrop-filter-blur bg-opacity-80 rounded-full flex items-center justify-center`}
        >
          <span className=" my-auto mx-auto text-4xl">{emoji}</span>
        </div>
      </div>
      <p className="mb-6 text-center text-gray-12">{message}</p>
    </>
  )
}

export default CuteInfo
