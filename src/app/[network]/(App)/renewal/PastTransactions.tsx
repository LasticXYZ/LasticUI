import Border from '@/components/border/Border'
import GeneralTable from '@/components/table/GeneralTable'
import { network_list } from '@/config/network'
import { parseNativeTokenToHuman } from '@/utils/account/token'
import { getChainFromPath } from '@/utils/common/chainPath'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { GraphLike, RenewableEvent, getClient } from '@poppyseed/squid-sdk'
import { format } from 'date-fns'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

const PastTransactions = () => {
  const { activeAccount, activeChain } = useInkathon()
  const pathname = usePathname()
  const network = getChainFromPath(pathname)
  const tokenSymbol = network_list[network].tokenSymbol

  const [result, setResult] = useState<GraphLike<RenewableEvent[]> | null>(null)
  const client = useMemo(() => getClient(), [])

  useEffect(() => {
    if (activeAccount) {
      let query = client.eventAllRenewed()
      if (network && query) {
        const fetchData = async () => {
          const fetchedResult: GraphLike<RenewableEvent[]> = await client.fetch(network, query)
          setResult(fetchedResult)
        }

        fetchData()
      }
    }
  }, [activeAccount, activeChain, client, network])

  const TableHeader = [
    { title: 'Time' },
    { title: 'Block Number' },
    { title: 'Core' },
    { title: 'Price' },
  ]

  // Transform result into table data
  const TableData =
    result?.data.event?.map((event, index) => ({
      data: [
        event.timestamp ? format(new Date(event.timestamp), 'MMMM dd, yyyy HH:mm:ss OOOO') : '',
        event.blockNumber?.toString(),
        event.core?.toString(),
        `${parseNativeTokenToHuman({ paid: event.price?.toString(), decimals: 12, reduceDecimals: 6 })} ${tokenSymbol}`,
      ],
    })) || []

  return (
    <div className="mt-8">
      <Border>
        <div className="mx-auto max-w-9xl px-4 mt-5 sm:px-6 lg:px-8">
          <div className="pt-10 pl-10">
            <h1 className="text-xl font-unbounded uppercase font-bold">Past Renewals</h1>
          </div>
          <div>
            {result ? (
              <GeneralTable
                tableData={TableData}
                tableHeader={TableHeader}
                colClass="grid-cols-4"
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
