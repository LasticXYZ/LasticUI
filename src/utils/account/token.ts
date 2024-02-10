export function parseNativeTokenToHuman({ paid, decimals }: { paid: string; decimals: number }) {
  const numberWithoutCommas = paid.replace(/,/g, '')
  const number = parseInt(numberWithoutCommas, 10)
  return number / 10 ** decimals
}


export function toShortAddress(address: string, howMany: number = 6) {
  return `${address.slice(0, howMany)}...${address.slice(-howMany)}`
}