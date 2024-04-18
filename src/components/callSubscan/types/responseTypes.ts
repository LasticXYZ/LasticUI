export interface AuctionResponse {
  code: number
  data: {
    auctions: [
      {
        auction_index: number
        early_end_block: number
        end_block: number
        extinguish_block: number
        lease_index: number
        start_block: number
        status: number
        winners?: [
          {
            amount: number
            auction_index: number
            bid_count: number
            bid_id: string
            bidder_account: string
            bidder_account_display: {
              account_index?: string
              address: string
              display?: string
              evm_contract?: {
                contract_name: string
              }
              identity?: boolean
              judgements?: [
                {
                  index: number
                  judgement: string
                },
              ]
              merkle?: {
                address_type: string
                tag_name: string
                tag_subtype: string
                tag_type: string
              }
              parent?: {
                address: string
                display: string
                identity: boolean
                sub_symbol: string
              }
            }
            block_num: number
            block_timestamp: number
            event_index: string
            extrinsic_index: string
            first_period: number
            fund_id: string
            last_period: number
            para_id: number
            source: number
            status: number
          },
        ]
      },
    ]
    count: number
  }
  generated_at: number
  message: string
}

export interface ParachainInfoResponse {
  code: number
  data: {
    chains: [
      {
        begin_period: number
        bid_id: string
        first_period: number
        fund_id: string
        last_period: number
        manager_display: {
          account_index: string
          address: string
          display: string
          evm_contract: {
            contract_name: string
          }
          identity: boolean
          judgements: [
            {
              index: number
              judgement: string
            },
          ]
          merkle: {
            address_type: string
            tag_name: string
            tag_subtype: string
            tag_type: string
          }
          parent: {
            address: string
            display: string
            identity: boolean
            sub_symbol: string
          }
        }
        open_channel_count: number
        para_id: number
        reserved_extrinsic_index: string
        status: string
        xcm_receive_message_count: number
        xcm_receive_transfer_count: number
        xcm_send_message_count: number
        xcm_send_transfer_count: number
      },
    ]
    count: number
  }
  generated_at: number
  message: string
}
