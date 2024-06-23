export type QueryParams = (string | number | Record<string, unknown>)[]

export const typeOfChain: 'PARA' | 'RELAY' | 'LOCAL' = 'PARA'

export * from './chainState'
export * from './region'

export type SaleInfoType = {
  saleStart: number
  leadinLength: number
  endPrice: number
  regionBegin: number
  regionEnd: number
  idealCoresSold: number
  coresOffered: number
  firstCore: number
  selloutPrice: number | null
  coresSold: number
}
