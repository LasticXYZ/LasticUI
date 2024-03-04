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

export function setAllToTrue(boolArray: boolean[]): boolean[] {
  const allTrueArray = new Array(boolArray.length).fill(true)
  return allTrueArray
}

export function setAlternateToTrue(boolArray: boolean[]): boolean[] {
  const updatedArray = new Array(boolArray.length).fill(false)
  for (let i = 0; i < updatedArray.length; i += 2) {
    updatedArray[i] = true
  }

  return updatedArray
}

export function toggleArrayValues(boolArray: boolean[]): boolean[] {
  const toggledArray = boolArray.map((value) => !value)

  return toggledArray
}

export function setFirstHalf(length: number): boolean[] {
  const halfPoint = Math.floor(length / 2)

  const firstHalf = new Array(halfPoint).fill(true)
  const secondHalf = new Array(length - halfPoint).fill(false)

  const resultArray = firstHalf.concat(secondHalf)

  return resultArray
}
