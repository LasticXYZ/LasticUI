import Border from '@/components/border/Border'
import GeneralTable from '@/components/table/GeneralTable'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { network_list } from '@/config/network'
import { ParachainInfo } from '@/hooks/useParachainInfo'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { useState } from 'react'

const ParaIdFetch = ({ parachains }: { parachains: ParachainInfo[] }) => {
  const { activeAccount, activeChain } = useInkathon()
  const [filter, setFilter] = useState('all')
  const [task, setTask] = useState<number | null>(null)
  const [core, setCore] = useState<number | null>(null)
  const [begin, setBegin] = useState<number | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  // Pagination functions
  const handleNextPage = () => setCurrentPage(currentPage + 1)
  const handlePrevPage = () => setCurrentPage(currentPage - 1)

  if (!activeChain) {
    return (
      <Border className="h-full flex flex-row justify-center items-center">
        <WalletStatus />
      </Border>
    )
  }

  return (
    <Border className="h-full flex flex-row justify-center items-center">
      <div className="h-full w-full flex flex-col justify-start items-start p-10">
        <h1 className="text-xl font-bold uppercase mb-5">Cores set for execution - Workload</h1>
        <div className="flex flex-row items-center gap-3 mb-5">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All</option>
            <option value="tasks">Tasks</option>
            <option value="pool">Pool</option>
          </select>
          {filter === 'tasks' && (
            <>
              <label htmlFor="task">Task:</label>
              <input
                id="task"
                type="number"
                placeholder="Task Number"
                value={task || ''}
                onChange={(e) => setTask(parseFloat(e.target.value) || null)}
                className="ml-2 p-2 border rounded"
              />
            </>
          )}
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
        {parachains ? (
          <>
            <div className="w-full overflow-x-auto">
              <GeneralTable
                tableData={parachains.map(({ paraId, state, network }) => ({
                  data: [
                    paraId.toString(),
                    network_list[network]?.paraId[paraId.toString()]?.name,
                    network_list[network]?.paraId[paraId.toString()]?.description,
                    state,
                    network_list[network]?.paraId[paraId.toString()]?.lease,
                    ,
                  ],
                }))}
                tableHeader={[
                  { title: 'ParaId' },
                  { title: 'Name' },
                  { title: 'Description' },
                  { title: 'Status' },
                  { title: 'Lease Period' },
                ]}
                colClass="grid-cols-5"
              />
            </div>
          </>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </Border>
  )
}

export default ParaIdFetch
