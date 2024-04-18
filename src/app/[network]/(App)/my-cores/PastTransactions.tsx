import Border from '@/components/border/Border'
import GeneralTable from '@/components/table/GeneralTable'
import { parseNativeTokenToHuman } from '@/utils/account/token'
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import { GraphLike, GraphQuery, PurchasedEvent, getClient } from '@poppyseed/squid-sdk'
import { format } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'

const PastTransactions = () => {
  const { activeAccount, activeRelayChain } = useInkathon()
  const network = activeRelayChain?.network

  const [result, setResult] = useState<GraphLike<PurchasedEvent[]> | null>(null)
  const client = useMemo(() => getClient(), [])

  let { tokenSymbol } = useBalance(activeAccount?.address, true)
  tokenSymbol = tokenSymbol || 'UNIT'

  let query: GraphQuery
  //const newAddress = encodeAddress(publicKeyBytes, targetNetworkPrefix)
  if (activeAccount) {
    query = client.eventWhoPurchased(activeAccount?.address)
  }

  useEffect(() => {
    if (network && query) {
      const fetchData = async () => {
        const fetchedResult: GraphLike<PurchasedEvent[]> = await client.fetch(network, query)
        setResult(fetchedResult)
      }

      fetchData()
    }
  }, [])

  const reversedData = useMemo(() => {
    // Make a copy of the event array (if it exists) and reverse the copy
    return [...(result?.data.event || [])].reverse()
  }, [result])

  const TableHeader = [
    { title: 'Time' },
    { title: 'Block Number' },
    { title: 'Transaction Type' },
    { title: 'Core' },
    { title: 'RegionID Begin' },
    { title: 'Mask' },
    { title: 'Price' },
  ]

  // Transform result into table data
  const TableData =
    reversedData.map((event, index) => ({
      data: [
        event.timestamp ? format(new Date(event.timestamp), 'MMMM dd, yyyy HH:mm:ss OOOO') : '',
        event.blockNumber?.toString(),
        'Purchase',
        event.regionId.core?.toString(),
        event.regionId.begin?.toString(),
        event.regionId.mask,
        `${parseNativeTokenToHuman({ paid: event.price?.toString(), decimals: 12 })} ${tokenSymbol}`,
      ],
    })) || []

  return (
    <div className="mt-8">
      <Border>
        <div className="mx-auto max-w-9xl px-4 mt-5 sm:px-6 lg:px-8">
          <div className="pt-10 pl-10">
            <h1 className="text-xl font-unbounded uppercase font-bold">My transactions</h1>
          </div>
          <div>
            {result ? (
              <GeneralTable
                tableData={TableData}
                tableHeader={TableHeader}
                colClass="grid-cols-7"
              />
            ) : (
              <p>Loading transactions...</p>
            )}
          </div>
        </div>
      </Border>
    </div>
  )
}

export default PastTransactions
