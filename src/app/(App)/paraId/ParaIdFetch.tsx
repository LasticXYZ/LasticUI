import Border from '@/components/border/Border'
import GeneralTable from '@/components/table/GeneralTable'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import { useEffect, useState } from 'react'

type AssignmentItem = {
  Task: number
}

type AssignmentItemUnf = {
  Task: string
}

type WorkplanAssignmentInfo = {
  mask: string
  assignment: AssignmentItem | 'Pool'
}

type WorkplanAssignmentInfoUnf = {
  mask: string
  assignment: AssignmentItemUnf | 'Pool'
}

type WorkplanCoreInfo = {
  begin: number
  core: number
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
            const assignmentInfoUnf = value.toHuman() as WorkplanAssignmentInfoUnf[]
            const assignmentInfo = assignmentInfoUnf.map(info => {
              if (typeof info.assignment === 'object') {
                info.assignment.Task = parseFormattedNumber(info.assignment.Task)
              }
              return info
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

  const TableHeader = [
    { title: 'Task' },
    { title: 'Begin' },
    { title: 'Core' },
    { title: 'Mask' },
  ]

  let filteredData = workplanData;

  const [task, setTask] = useState<number|null>(null);
  const [core, setCore] = useState<number|null>(null);;
  const [begin, setBegin] = useState<number|null>(null);;


  if (workplanData && filter === 'all') {
    filteredData = workplanData.filter(
      plan => plan.assignmentInfo.some(info => info.assignment !== 'Pool' &&
      task? info.assignment?.Task === task: true && 
      core ? parseFormattedNumber(plan.coreInfo.core) === core: true &&
      begin ? parseFormattedNumber(plan.coreInfo.begin) === begin: true
  ))}
  else if (workplanData && filter === 'tasks') {
    filteredData = workplanData.filter(plan => plan.assignmentInfo.some(info => info.assignment !== 'Pool'));
  } else if (workplanData && filter === 'pool') {
    filteredData = workplanData.filter(plan => plan.assignmentInfo.some(info => info.assignment === 'Pool'));
  }

    // Transform filteredData for the GeneralTable component
    const transformedTableData = filteredData?.map((workplan) => {
      // Assuming that you want to show the first assignment info in the table.
      // Adjust this as needed for your application.
      const assignment = workplan.assignmentInfo[0].assignment;
      const task = typeof assignment === 'object' ? assignment.Task.toString() : assignment;
      const begin = workplan.coreInfo.begin.toString();
      const core = workplan.coreInfo.core.toString();
      const mask = workplan.assignmentInfo[0].mask;
  
      return {
        // Include 'href' if necessary, for now, it's omitted
        data: [task, begin, core, mask]
      };
    });
  
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
          <h1 className="text-xl font-unbounded uppercase font-bold">Cores set for execution</h1>
          <div className='mt-5 flex flex-row items-center gap-3'>

          {/* Dropdown for user to select filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded ml-5"
            >
            <option value="all">All</option>
            <option value="tasks">Tasks</option>
            <option value="pool">Pool</option>
          </select>
          <div className="">
            <label>Task:</label>
            <input
              type="number"
              placeholder="0"
              value={task || ''}
              onChange={(e) => setTask(parseFloat(e.target.value))}
              className="ml-2 p-2 border rounded"
              />
          </div>
          <label>Begin:</label>
          <input
            type="number"
            placeholder="0"
            value={begin || ''}
            onChange={(e) => setBegin(parseFloat(e.target.value))}
            className="p-2 border rounded"
            />
          <label>Core:</label>
          <input
            type="number"
            placeholder="0"
            value={core || ''}
            onChange={(e) => setCore(parseFloat(e.target.value))}
            className="p-2 border rounded"
            />
        </div>
        </div>
        <div>
          { transformedTableData ?
          <GeneralTable
          tableData={transformedTableData}
          tableHeader={TableHeader}
          colClass="grid-cols-6"
          />
          : <p>No data...</p>
        }
        </div>
      </div>
    </Border>
  )
}
