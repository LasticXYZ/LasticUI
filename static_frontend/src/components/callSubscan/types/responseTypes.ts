export interface AuctionResponse {
    code: number,
    data: {
        auctions: [
            {
                auction_index: number,
                early_end_block: number,
                end_block: number,
                extinguish_block: number,
                lease_index: number,
                start_block: number,
                status: number,
                winners?: [
                    {
                        amount: number,
                        auction_index: number,
                        bid_count: number,
                        bid_id: string,
                        bidder_account: string,
                        bidder_account_display: {
                            account_index?: string,
                            address: string,
                            display?: string,
                            evm_contract?: {
                                contract_name: string
                            },
                            identity?: true,
                            judgements?: [
                                {
                                    index: number,
                                    judgement: string
                                }
                            ],
                            merkle?: {
                                address_type: string,
                                tag_name: string,
                                tag_subtype: string,
                                tag_type: string
                            },
                            parent?: {
                                address: string,
                                display: string,
                                identity: true,
                                sub_symbol: string
                            }
                        },
                        block_num: number,
                        block_timestamp: number,
                        event_index: string,
                        extrinsic_index: string,
                        first_period: number,
                        fund_id: string,
                        last_period: number,
                        para_id: number,
                        source: number,
                        status: number
                    }
                ]
            }
        ],
        count: number
    },
    generated_at: number,
    message: string
}