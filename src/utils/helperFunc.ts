import { network_list } from '@/config/network'

export function joinClassNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

// Utility function for parsing numbers
export const parseFormattedNumber = (str?: string | number): number => {
  if (!str) return 0
  return typeof str === 'number' ? str : parseInt(str.replace(/,/g, ''), 10)
}

export const formatPrice = (price: string | number, network: string): string => {
  price = typeof price === 'number' ? price : +price
  const { tokenDecimals, tokenSymbol } = network_list[network]

  return `${Number(price) / 10 ** tokenDecimals} ${tokenSymbol}`
}
