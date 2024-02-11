export function parseNativeTokenToHuman({ paid, decimals = 12 }: { paid?: string | null; decimals: number }) {
  const numberWithoutCommas = paid?.replace(/,/g, '')
  const number = parseInt(numberWithoutCommas ? numberWithoutCommas : '0', 10)
  return number / 10 ** decimals
}


export function toShortAddress(address?: string | null, howMany: number = 6) {
  if (!address) {
    return ''
  }
  return `${address.slice(0, howMany)}...${address.slice(-howMany)}`
}