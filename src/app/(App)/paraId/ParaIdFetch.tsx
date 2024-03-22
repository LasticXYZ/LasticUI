import Border from '@/components/border/Border'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import { useEffect, useState } from 'react'

// Define a type for the queryParams
type QueryParams = (string | number | Record<string, unknown>)[]

type WorkplanCoreInfoItem = {
  begin: string
  core: string
}

type WorkplanCoreInfo = WorkplanCoreInfoItem[]


type AssignmentItem = {
  Task: string
}

type WorkplanAssignmentInfo = {
  mask: string
  assignment: AssignmentItem
}

type Workplan = {
  coreInfo: string[]
  assignmentInfo: WorkplanAssignmentInfo[]
}

type WorkplanType = Workplan[]

// Custom hook for querying substrate state
const useWorkplanQuery = () => {
  const { api } = useInkathon()
  const [data, setData] = useState<WorkplanType | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (api?.query?.broker?.workplan) {
        try {
          const entries = await api.query.broker.workplan.entries()
          //console.log('entries:', entries)
          const workplan: WorkplanType = entries.map(([key, value]) => {
            const coreInfo = key.toHuman() as string[]
            const assignmentInfo = value.toHuman() as WorkplanAssignmentInfo
            return { coreInfo, assignmentInfo }
          })
          console.log('workplan:', workplan)
          setData(workplan)
        } catch (error) {
          console.error('Failed to fetch regions:', error)
        }
      }
    }

    fetchData()
    const intervalId = setInterval(fetchData, 5000)

    return () => clearInterval(intervalId)
  }, [api])

  return data
}

export default function MyCores() {
  const { activeAccount, activeChain } = useInkathon()
  let { tokenSymbol } = useBalance(activeAccount?.address, true)
  const workplanData = useWorkplanQuery()

  if (!activeAccount || !activeChain) {
    return (
      <Border className="h-full flex flex-row justify-center items-center">
        <WalletStatus />
      </Border>
    )
  }
  return(
    <Border className="h-full flex flex-row justify-center items-center">
      <div className="h-full w-full flex flex-col justify-left items-left">
        <div className="pt-10 pl-10">
          <h1 className="text-xl font-unbounded uppercase font-bold">cores owned</h1>
        </div>
        <div>
          <ul>
          {workplanData?.map((workplan, index) => (
            <li key={index} className="p-1">
              <p>Begin: {workplan.coreInfo[0][0]}</p>
              <p>Core: {workplan.coreInfo[0][1]}</p>
              <p>Task:
              {workplan.assignmentInfo[0].assignment?.Task}
              </p>
              <p>Mask: {workplan.assignmentInfo[0].mask}</p>
            </li>
          ))}
          </ul>
        </div>
      </div>
    </Border>
  )
}
