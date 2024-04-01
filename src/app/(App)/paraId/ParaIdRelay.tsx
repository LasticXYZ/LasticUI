import Border from '@/components/border/Border'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { toShortHead } from '@/utils'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { useEffect, useState } from 'react'

type ParasHeadType = {
  parachain: string[]
  head: string
}

// Custom hook for querying and transforming workplan data
const useParasHead = () => {
  const { relayApi } = useInkathon()
  const [data, setData] = useState<ParasHeadType[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!relayApi?.query?.paras?.heads) return
      try {
        const entries = await relayApi.query.paras.heads.entries()
        const data: ParasHeadType[] = entries.map(([key, value]) => {
          const parachain: string[] = key.toHuman() as string[]

          const head: string = value.toHuman() as string

          return { parachain, head }
        })
        setData(data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchData()
    const intervalId = setInterval(fetchData, 5000)
    return () => clearInterval(intervalId)
  }, [relayApi])

  return data
}

// Custom hook for querying and transforming workplan data
const useParasParachains = () => {
  const { relayApi } = useInkathon()
  const [data, setData] = useState<string[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!relayApi?.query?.paras?.parachains) return
      try {
        const entries = await relayApi.query.paras.parachains()
        const data: string[] = entries.toHuman() as string[]
        console.log(data)
        setData(data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchData()
    const intervalId = setInterval(fetchData, 5000)
    return () => clearInterval(intervalId)
  }, [relayApi])

  return data
}

const ParaIdRelay = () => {
  const { activeChain } = useInkathon()
  const parasHead = useParasHead()
  const parasParachains = useParasParachains()

  // Merge and deduplicate parachain IDs from both parasParachains and parasHead
  const allParaIds = [
    ...(parasParachains || []),
    ...(parasHead || []).flatMap((head) => head.parachain),
  ]

  // Deduplicate allParaIds
  const uniqueParaIds = Array.from(new Set(allParaIds))

  // Combine the data, ensuring no duplicates and including all possible paraIds
  const combinedData = uniqueParaIds.map((paraId) => {
    const headData = parasHead?.find((head) => head.parachain.includes(paraId))
    return {
      parachain: paraId,
      head: headData ? toShortHead(headData.head) : 'No head registered',
      status: headData ? 'Registered' : 'Not registered',
      para: parasParachains?.includes(paraId) ? 'Parachain' : 'Parathread',
    }
  })

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
        <h1 className="text-xl font-bold uppercase mb-5">Executing on the Relay chain</h1>
        <div>
          <ul>
            {combinedData?.map((data, index) => (
              <li key={index}>
                Idx: {index} | Parachain: {data.parachain} | Head: {data.head} | Status:{' '}
                {data.status} | Type: {data.para}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ul></ul>
        </div>
        {/*
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
        
        {filteredData && filteredData.length > 0 ? (
          <>
            <div className="w-full overflow-x-auto">
              <GeneralTable
                tableData={filteredData.map(({ coreInfo, assignmentInfo }) => ({
                  data: [
                    assignmentInfo[0]?.assignment !== 'Pool' &&
                    typeof assignmentInfo[0]?.assignment === 'object'
                      ? assignmentInfo[0].assignment.Task.toString()
                      : 'Pool',
                    coreInfo.begin.toString(),
                    coreInfo.core.toString(),
                    assignmentInfo[0]?.mask || 'N/A',
                  ],
                }))}
                tableHeader={[
                  { title: 'Task' },
                  { title: 'Begin' },
                  { title: 'Core' },
                  { title: 'Mask' },
                ]}
                colClass="grid-cols-4"
              />
            </div>
            <div className="flex w-full items-center justify-between space-x-2 mt-4 px-5">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-2xl text-black border border-gray-21 font-semibold ${currentPage === 1 ? 'bg-gray-4 text-gray-18 cursor-not-allowed' : ' hover:bg-green-6'}`}
              >
                Previous
              </button>
              <p className="text-black font-semibold">{currentPage}</p>
              <button
                onClick={handleNextPage}
                disabled={filteredData.length < itemsPerPage || filteredData.length === 0}
                className={`px-4 py-2   border border-gray-21 text-black font-semibold rounded-2xl ${filteredData.length < itemsPerPage ? 'bg-gray-4 text-gray-18 cursor-not-allowed' : ' hover:bg-green-6'}`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p>No data available.</p>
        )}
      */}
      </div>
    </Border>
  )
}

export default ParaIdRelay
