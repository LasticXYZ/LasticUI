export function parseNativeTokenToHuman(
  { 
    paid,
    decimals
  } : {
    paid: string,
    decimals: number
  }) {
    const numberWithoutCommas = paid.replace(/,/g, '')
    const number = parseInt(numberWithoutCommas, 10)
    return number / 10 ** decimals
  }