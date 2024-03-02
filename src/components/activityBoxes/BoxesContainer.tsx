import React, { useState } from 'react'
import SquareBox from './SquareBox'

interface SquareBoxesContainerProps {
  startTime: Date
  endTime: Date
  size: [number, number]
}

const SquareBoxesContainer: React.FC<SquareBoxesContainerProps> = ({
  startTime,
  endTime,
  size,
}) => {
  const subIntervalDurationInMinutes = 8 // Minuts
  const intervalInSeconds = subIntervalDurationInMinutes * 60
  // Number of coremask bits
  const countOfBits = 80

  // Initialize an array of n bits set to 0 // its core-mask bits
  const [bits, setBits] = useState<Array<boolean>>(new Array(countOfBits).fill(false))

  const addSeconds = (date: Date, seconds: number) => new Date(date.getTime() + seconds * 1000)
  const formatTime = (date: Date) => date.toISOString().substring(0, 16).replace('T', ' ')

  // Generate each SquareBox component
  const squareBoxes = []
  let partStartTime = startTime

  // Function to toggle bit value at a given index
  const toggleBit = (index: number) => {
    const newBits = [...bits]
    newBits[index] = !newBits[index]
    setBits(newBits)
    console.log(newBits)
  }
  const generateHexStringFromBooleans = (bools: Array<boolean>) => {
    const bitString = bools.map((b) => (b ? '1' : '0')).join('')
    let hexString = ''
    for (let i = 0; i < bitString.length; i += 4) {
      const chunk = bitString.substring(i, i + 4)
      const hexDigit = parseInt(chunk, 2).toString(16)
      hexString += hexDigit
    }

    return hexString
  }

  const hexString = generateHexStringFromBooleans(bits)
  console.log(hexString)

  for (let i = 0; i < countOfBits; i++) {
    const partEndTime = addSeconds(partStartTime, intervalInSeconds - 1) // Subtract one second to make room for the next interval starting one second later

    squareBoxes.push(
      <SquareBox
        id={i}
        startTime={formatTime(partStartTime)}
        endTime={formatTime(partEndTime)}
        size={size}
        clicked={bits[i]}
        onClick={toggleBit}
      />,
    )

    // Set the next partStartTime to be one second after the current partEndTime
    partStartTime = addSeconds(partEndTime, 1)
  }

  return (
    <>
      <div className="flex flex-wrap justify-center items-center gap-4">{squareBoxes} </div>
      <p className="text-sm font-bold">New Core Mask: {hexString}</p>
    </>
  )
}

export default SquareBoxesContainer
