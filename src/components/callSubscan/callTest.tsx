import axios from 'axios'
import React, { useEffect } from 'react'

const token = process.env.NEXT_PUBLIC_SUBSCAN_TOKEN

export const CallTest: React.FC = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestData = {
          auction_index: 0,
          page: 0,
          row: 10,
          status: 0,
        }

        const config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://polkadot.api.subscan.io/api/scan/parachain/auctions',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': token,
          },
          data: JSON.stringify(requestData),
        }

        const response = await axios.request(config)
        console.log(JSON.stringify(response.data))
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, []) // Empty dependency array ensures the effect runs once after component mount

  // Return null or JSX here
  return (
    <div>
      <h1>CallTest</h1>
    </div>
  )
}
