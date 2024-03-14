import React from 'react'

interface ColorBoxWithTextProps {
  color: string
  text: string
}

const Legend: React.FC<ColorBoxWithTextProps> = ({ color, text }) => {
  return (
    <div className="flex items-center">
      <div className="w-4 h-4 bg-[color] rounded-full" style={{ backgroundColor: color }}></div>
      <p className="text-sm font-medium ml-2">{text}</p>
    </div>
  )
}

export default Legend
