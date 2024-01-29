export function parseNativeTokenToHuman({ paid, decimals }: { paid: string; decimals: number }) {
  const numberWithoutCommas = paid.replace(/,/g, '')
  const number = parseInt(numberWithoutCommas, 10)
  return number / 10 ** decimals
}


export function toShortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-6)}`
}