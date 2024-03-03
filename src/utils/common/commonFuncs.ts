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
