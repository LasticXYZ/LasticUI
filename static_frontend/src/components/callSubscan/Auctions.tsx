import React, { useMemo } from 'react';
import { 
    AuctionResponse,
    AuctionsRequest
} from './types';
import { useSubScanCall } from './callSubScan';

export const Auctions: React.FC = () => {
  const requestData = useMemo<AuctionsRequest>(() => ({
    auction_index: 0,
    page: 0,
    row: 10,
    status: 0,
  }), []);

  const { data: auctionData, loading, error }  = useSubScanCall<AuctionResponse>({
    apiUrl: "https://polkadot.api.subscan.io/api/scan/parachain/auctions",
    requestData: requestData,
  })
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return auctionData ? (
      <table>
        <thead>
          <tr className='p-3'>
            <th className='p-3'>Auction Index</th>
            <th className='p-3'>Start Block</th>
            <th className='p-3'>End Block</th>
            <th className='p-3'>Early End Block</th>
            <th className='p-3'>Extinguish Block</th>
            <th className='p-3'>Lease Period</th>
            <th className='p-3'>Winners</th>
          </tr>
        </thead>
        <tbody>
          {auctionData.data.auctions.map((auction) => (
            <tr key={auction.auction_index}>
              <td>{auction.auction_index}</td>
              <td>{auction.start_block}</td>
              <td>{auction.end_block}</td>
              <td>{auction.early_end_block}</td>
              <td>{auction.extinguish_block}</td>
              <td>{auction.lease_index}</td>
              {auction.winners ? auction.winners.map((winner) => ( 
                <td className='py-2'>
                  <ul>
                    <li>Amount: {winner.amount / 1000000000} DOT</li>
                    <li>Winner: {winner.bidder_account}</li>
                  </ul>
                </td>
              )) : "Auction ongoing"}
            </tr>
          ))}
        </tbody>
      </table>
    ) : null;
};

