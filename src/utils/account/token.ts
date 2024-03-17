export function parseNativeTokenToHuman({
  paid,
  decimals = 12,
  reduceDecimals = 2,
}: {
  paid?: string | null
  decimals: number
  reduceDecimals?: number
}) {
  const numberWithoutCommas = paid?.replace(/,/g, '')
  const number = parseInt(numberWithoutCommas ? numberWithoutCommas : '0', 10)
  const result = number / 10 ** decimals;
  return result.toFixed(reduceDecimals);

}

export function toShortAddress(address?: string | null, howMany: number = 6) {
  if (!address) {
    return ''
  }
  return `${address.slice(0, howMany)}...${address.slice(-howMany)}`
}
