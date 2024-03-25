import Border from '@/components/border/Border'
import GeneralTable from '@/components/table/GeneralTable'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import {
  AllowedRenewalAssignmentInfo,
  AllowedRenewalCoreInfoUnf,
  AllowedRenewalsType,
} from '@/types'
import { parseFormattedNumber, parseNativeTokenToHuman } from '@/utils'
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import { useEffect, useState } from 'react'

// Custom hook for querying and transforming workplan data
const useAllowedRenewalsQuery = () => {
  const { api } = useInkathon()
  const [data, setData] = useState<AllowedRenewalsType | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!api?.query?.broker?.workplan) return
      try {
        const entries = await api.query.broker.allowedRenewals.entries()
        const allowedRenewals: AllowedRenewalsType = entries.map(([key, value]) => {
          const coreInfo: AllowedRenewalCoreInfoUnf[] = key.toHuman() as AllowedRenewalCoreInfoUnf[]
          const assignmentInfo: AllowedRenewalAssignmentInfo =
            value.toHuman() as AllowedRenewalAssignmentInfo
          return { coreInfo, assignmentInfo }
        })
        console.log(allowedRenewals)
        setData(allowedRenewals)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchData()
    const intervalId = setInterval(fetchData, 5000)
    return () => clearInterval(intervalId)
  }, [api])

  return data
}

const RenewalsData = () => {
  const { activeAccount, activeChain } = useInkathon()
  const allowedRenewals = useAllowedRenewalsQuery()
  const [task, setTask] = useState<number | null>(null)
  const [core, setCore] = useState<number | null>(null)
  const [begin, setBegin] = useState<number | null>(null)

  let { tokenSymbol } = useBalance(activeAccount?.address, true)

  // Data filtering based on user selection
  const filteredData = allowedRenewals?.filter((plan) => {
    return (
      (!core || parseFormattedNumber(plan.coreInfo[0].core) === core) &&
      (!begin || parseFormattedNumber(plan.coreInfo[0].when) === begin) &&
      (!task ||
        parseFormattedNumber(plan.assignmentInfo.completion?.Complete[0]?.assignment.Task) === task)
    )
  })

  if (!activeAccount || !activeChain) {
    return (
      <Border className="h-full flex flex-row justify-center items-center">
        <WalletStatus />
      </Border>
    )
  }

  return (
    <Border className="h-full flex flex-row justify-center items-center">
      <div className="h-full w-full flex flex-col justify-start items-start p-10">
        <h1 className="text-xl font-bold uppercase mb-5">Cores set for execution</h1>
        <div className="flex flex-row items-center gap-3 mb-5">
          <label htmlFor="task">Task:</label>
          <input
            id="task"
            type="number"
            placeholder="Task Number"
            value={task || ''}
            onChange={(e) => setTask(parseFloat(e.target.value) || null)}
            className="ml-2 p-2 border rounded"
          />
          <label htmlFor="begin">Begin:</label>
          <input
            id="begin"
            type="number"
            placeholder="Begin Number"
            value={begin || ''}
            onChange={(e) => setBegin(parseFloat(e.target.value) || null)}
            className="p-2 border rounded"
          />
          <label htmlFor="core">Core:</label>
          <input
            id="core"
            type="number"
            placeholder="Core Number"
            value={core || ''}
            onChange={(e) => setCore(parseFloat(e.target.value) || null)}
            className="p-2 border rounded"
          />
        </div>
        {filteredData && filteredData.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <GeneralTable
              tableData={filteredData.map(({ coreInfo, assignmentInfo }) => ({
                data: [
                  coreInfo[0].when,
                  coreInfo[0].core,
                  assignmentInfo.completion?.Complete[0]?.assignment.Task || 'N/A',
                  assignmentInfo.completion?.Complete[0]?.mask || 'N/A',
                  `${parseNativeTokenToHuman({ paid: assignmentInfo.price?.toString(), decimals: 12, reduceDecimals: 6 })} ${tokenSymbol}`,
                  //<PrimaryButton title='Renew' />,
                ],
              }))}
              tableHeader={[
                { title: 'Begin' },
                { title: 'Core' },
                { title: 'Task' },
                { title: 'Mask' },
                { title: 'Price' },
                //{ title: 'Click to Renew' },
              ]}
              colClass="grid-cols-5"
            />
          </div>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </Border>
  )
}

export default RenewalsData
