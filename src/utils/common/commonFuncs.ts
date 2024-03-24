export type CoreMask = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
]

export const getCoreMaskFromBits = (bits: boolean[]): CoreMask => {
  if (bits.length !== 80) {
    throw new Error('Expected an array of 80 bits')
  }

  const coreMask: CoreMask = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  for (let i = 0; i < bits.length; i += 8) {
    // Process each chunk of 8 bits
    let byteValue = 0
    for (let bit = 0; bit < 8; bit++) {
      if (bits[i + bit]) {
        byteValue |= 1 << (7 - bit)
      }
    }
    // Ensure index is an integer
    coreMask[Math.floor(i / 8)] = byteValue
  }

  return coreMask
}

export const generateHexStringFromBooleans = (bools: Array<boolean>) => {
  const bitString = bools.map((b) => (b ? '1' : '0')).join('')
  let hexString = ''
  for (let i = 0; i < bitString.length; i += 4) {
    const chunk = bitString.substring(i, i + 4)
    const hexDigit = parseInt(chunk, 2).toString(16)
    hexString += hexDigit
  }

  return hexString
}

export function hexStringToBoolArray(hex: string): boolean[] {
  const normalizedHex = hex.startsWith('0x') ? hex.substring(2) : hex
  const binaryString = Array.from(normalizedHex)
    .map(
      // Convert each hex digit to a 4-bit binary string
      (hexDigit) => parseInt(hexDigit, 16).toString(2).padStart(4, '0'),
    )
    .join('')
  const boolArray = Array.from(binaryString).map((bit) => bit === '1')
  return boolArray
}

export function setAllToTrue(boolArray: boolean[], allTrue: boolean): boolean[] {
  const allTrueArray = new Array(boolArray.length).fill(!allTrue)
  return allTrueArray
}

export function setAlternateToTrue(
  boolArray: boolean[],
  oddTrue: boolean,
  currentMask: boolean[],
): boolean[] {
  const updatedArray = boolArray.map((element, index) => {
    // Determine if the current index should be set to true based on oddTrue
    const shouldBeTrue = oddTrue ? index % 2 !== 0 : index % 2 === 0

    // Return the new value based on shouldBeTrue and currentMask
    // If shouldBeTrue and the corresponding mask bit is true, keep it true; otherwise, false
    return shouldBeTrue && currentMask[index]
  })

  return updatedArray
}

export function toggleArrayValues(boolArray: boolean[]): boolean[] {
  const toggledArray = boolArray.map((value) => !value)

  return toggledArray
}

export function setHalf(currentMask: boolean[], first: boolean): boolean[] {
  // Calculate the total number of true bits in currentMask
  const trueCount = currentMask.filter((bit) => bit).length

  // Calculate the number of true bits to set based on the first parameter
  const trueToSet = Math.floor(trueCount / 2)

  // Initialize a counter for how many true bits we've set
  let setCount = 0

  // Create the result array by mapping over the currentMask
  const resultArray = currentMask.map((bit, index) => {
    if (!bit) {
      // If the current mask bit is false, the result bit should also be false
      return false
    } else {
      setCount++ // Increment setCount since we're setting this bit to true
      // For true bits in the mask, decide based on setCount and trueToSet
      if (setCount <= trueToSet) {
        return first
      } else {
        return !first
      }
    }
  })

  return resultArray
}

export function getComplementaryMaskBits(a: boolean[], b: boolean[]): boolean[] {
  // Ensure arrays are of the same length to avoid errors
  if (a.length !== b.length) {
    throw new Error('Arrays must be of the same length')
  }
  //XOR
  const result = a.map((element, index) => element !== b[index])

  return result
}
