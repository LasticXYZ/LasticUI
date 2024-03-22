import Border from '@/components/border/Border'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import { useEffect, useState } from 'react'

type AssignmentItem = {
  Task: string | number
}

type WorkplanAssignmentInfo = {
  mask: string
  assignment: AssignmentItem | 'Pool'
}

type WorkplanCoreInfo = {
  begin: number
  core: number
}

type WorkplanUnformatted = {
  coreInfo: string[]
  assignmentInfo: WorkplanAssignmentInfo[]
}

type Workplan = {
  coreInfo: WorkplanCoreInfo
  assignmentInfo: WorkplanAssignmentInfo[]
}

type WorkplanType = Workplan[]


function parseFormattedNumber(str?: string | number) {
  if (!str) {
    return 0;
  }
  if (typeof str === 'number') {
    return str;
  }
  return parseInt(str.replace(/,/g, ''), 10); // Removes all commas before parsing
}

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
            const coreInfoUnf: string[] = key.toHuman() as string[]
            let coreInfo: WorkplanCoreInfo = {core: 0, begin: 0};
            if (coreInfoUnf.length > 0 && coreInfoUnf[0].length > 1) {
              coreInfo = {
                  begin: parseFormattedNumber(coreInfoUnf[0][0]), // Convert the first string to a number
                  core: parseFormattedNumber(coreInfoUnf[0][1]) // Convert the second string to a number
              };
            } else {
                console.error("Unexpected coreInfoUnf structure:", coreInfoUnf);
            }
            const assignmentInfo = value.toHuman() as WorkplanAssignmentInfo[]
            assignmentInfo.map(info => {
              if (typeof info.assignment === 'object') {
                info.assignment.Task = parseFormattedNumber(info.assignment.Task)
              }
            })
            return { coreInfo, assignmentInfo }
          })
          //console.log('workplan:', workplan)
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
  const workplanData = useWorkplanQuery();
  const [filter, setFilter] = useState('all'); // New state for tracking the filter

  let filteredData = workplanData;

  const task = undefined;
  const core = undefined;
  const begin = 121650;

  if (workplanData && filter !== 'pool') {
    filteredData = workplanData.filter(
      plan => plan.assignmentInfo.some(info => info.assignment !== 'Pool' &&
      task? info.assignment?.Task === task: true && 
      core ? parseFormattedNumber(plan.coreInfo.core) === core: true &&
      begin ? parseFormattedNumber(plan.coreInfo.begin) === begin: true
    ));
  } else if (workplanData && filter === 'pool') {
    filteredData = workplanData.filter(plan => plan.assignmentInfo.some(info => info.assignment === 'Pool'));
  }
  console.log('filteredData:', filteredData)
  
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
          <h1 className="text-xl font-unbounded uppercase font-bold">Cores Owned</h1>
          {/* Dropdown for user to select filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mb-5"
          >
            <option value="tasks">Tasks</option>
            <option value="pool">Pool</option>
          </select>
        </div>
        <div>
          <ul>
            {filteredData?.map((workplan, index) => (
              <li key={index} className="p-1">
                <p>Task: {' '}
                {typeof workplan.assignmentInfo[0].assignment === 'object'
                  ? workplan.assignmentInfo[0].assignment?.Task
                  : workplan.assignmentInfo[0].assignment}
                </p>
                <p>Begin: {workplan.coreInfo.begin}</p>
                <p>Core: {workplan.coreInfo.core}</p>
                <p>Mask: {workplan.assignmentInfo[0].mask}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Border>
  )
}
