export interface AuctionsRequest {
  auction_index?: number
  /**
   * Page number, starting from 0
   */
  page?: number
  /**
   * Data size per page
   */
  row?: number
  status?: number
  [property: string]: any
}

export interface ParachainInfoRequest {
  page?: number
  row?: number
  para_id?: number
  order: string
  status?: string[]
}
