import React, { useState } from 'react'
import {
  hexStringToBoolArray,
  setAllToTrue,
  setAlternateToTrue,
  setFirstHalf,
  toggleArrayValues,
} from '../../utils/common/commonFuncs'
import SquareBox from './SquareBox'

interface SquareBoxesContainerProps {
  startTime: Date
  endTime: Date
  size: [number, number]
  onMaskUpdate: (bits: Array<boolean>) => void
  mask: string
}

const SquareBoxesContainer: React.FC<SquareBoxesContainerProps> = ({
  startTime,
  endTime,
  size,
  onMaskUpdate,
  mask,
}) => {
  const subIntervalDurationInMinutes = 8 // Minutes
  const intervalInSeconds = subIntervalDurationInMinutes * 60
  // Number of coremask bits
  const countOfBits = 80

  // Initialize an array of n bits set to 0 // its core-mask bits
  const [bits, setBits] = useState<Array<boolean>>(hexStringToBoolArray(mask))

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
    onMaskUpdate(newBits)
    // console.log(newBits)
  }

  const handleSetAllToTrue = () => {
    const updatedBits = setAllToTrue(bits)
    setBits(updatedBits)
    onMaskUpdate(updatedBits)
  }

  const handleToggleBits = () => {
    const updatedBits = toggleArrayValues(bits)
    setBits(updatedBits)
    onMaskUpdate(updatedBits)
  }

  const handleSetFirstHalfToTrue = () => {
    const updatedBits = setFirstHalf(bits.length)
    setBits(updatedBits)
    onMaskUpdate(updatedBits)
  }

  const handleSetAlternateToTrue = () => {
    const updatedBits = setAlternateToTrue(bits)
    setBits(updatedBits)
    onMaskUpdate(updatedBits)
  }

  const handleReset = () => {
    const originalBits = hexStringToBoolArray(mask)
    setBits(originalBits)
    onMaskUpdate(originalBits)
  }

  for (let i = 0; i < countOfBits; i++) {
    const partEndTime = addSeconds(partStartTime, intervalInSeconds - 1)

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
      <div className="flex justify-around mt-8">
        <button
          className="rounded-ful font-black rounded-2xl bg-pink-2 hover:bg-pink-4 border border-gray-8 text-xs inline-flex items-center justify-center p-2 text-center text-black hover:bg-primary-800 focus:ring-4 focus:ring-primary-3"
          onClick={handleSetAllToTrue}
        >
          Set All to True
        </button>

        <button
          className="rounded-ful font-black rounded-2xl bg-pink-2 hover:bg-pink-4 border border-gray-8 text-xs inline-flex items-center justify-center p-2 text-center text-black hover:bg-primary-800 focus:ring-4 focus:ring-primary-3"
          onClick={handleSetFirstHalfToTrue}
        >
          Set First Half to True
        </button>

        <button
          className="rounded-ful font-black rounded-2xl bg-pink-2 hover:bg-pink-4 border border-gray-8 text-xs inline-flex items-center justify-center p-2 text-center text-black hover:bg-primary-800 focus:ring-4 focus:ring-primary-3"
          onClick={handleSetAlternateToTrue}
        >
          Set Alternate to True
        </button>

        <button
          className="rounded-ful font-black rounded-2xl bg-pink-2 hover:bg-pink-4 border border-gray-8 text-xs inline-flex items-center justify-center p-2 text-center text-black hover:bg-primary-800 focus:ring-4 focus:ring-primary-3"
          onClick={handleToggleBits}
        >
          Toggle Bits
        </button>

        <button
          className="rounded-ful font-black rounded-2xl bg-pink-2 hover:bg-pink-4 border border-gray-8 text-xs inline-flex items-center justify-center p-2 text-center text-black hover:bg-primary-800 focus:ring-4 focus:ring-primary-3"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </>
  )
}

export default SquareBoxesContainer
