export type QueryParams = (string | number | Record<string, unknown>)[]

export const typeOfChain: 'PARA' | 'RELAY' | 'LOCAL' = 'PARA'

export * from './chainState'
export * from './region'
