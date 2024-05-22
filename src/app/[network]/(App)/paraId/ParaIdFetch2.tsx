import Border from '@/components/border/Border'
import NumberField from '@/components/inputField/NumberField'
import GeneralTableWithButtons from '@/components/table/GeneralTableWithButtons'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { network_list } from '@/config/network'
import { ParachainInfo, ParachainState } from '@/hooks/useParachainInfo'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { ChangeEvent, useState } from 'react'

const statusColors = {
  'System Chain': 'bg-blue-200',
  'Currently Active': 'bg-green-200',
  'Idle Chain': 'bg-yellow-200',
  Reserved: 'bg-red-200',
  Onboarding: 'bg-purple-200',
  Parathread: 'bg-indigo-200',
  'Idle(In workplan)': 'bg-pink-200',
  'Holding Slot': 'bg-orange-200',
}

const ParaIdFetch = ({ parachains }: { parachains: ParachainInfo[] }) => {
  const { activeChain } = useInkathon()
  const [filter, setFilter] = useState<string>('all')
  const [paraIdSET, setParaId] = useState<number | null>(null)

  if (!activeChain) {
    return (
      <Border className="h-full flex flex-row justify-center items-center">
        <WalletStatus />
      </Border>
    )
  }

  const handleParaIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setParaId(value ? parseFloat(value) : null)
  }

  const filteredParachains = parachains.filter((parachain) => {
    const matchesFilter = filter === 'all' || parachain.state === filter
    const matchesParaId = paraIdSET === null || parachain.paraId === paraIdSET
    return matchesFilter && matchesParaId
  })

  return (
    <Border className="h-full flex flex-row justify-center items-center">
      <div className="h-full w-full flex flex-col justify-start items-start p-10">
        <h1 className="text-xl font-bold uppercase mb-5">Status of {filter} cores</h1>
        <div className="grid grid-cols-3 gap-10 items-start">
          <NumberField
            label="ParaId"
            value={paraIdSET !== null ? paraIdSET.toString() : ''}
            onChange={handleParaIdChange}
            className="mb-5"
          />
          <div className="flex flex-wrap col-span-2 gap-3 mb-5">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-black dark:text-white ${filter === 'all' ? 'font-bold' : ''}`}
            >
              All
            </button>
            {Object.entries(ParachainState).map(([stateKey, stateValue]) => (
              <button
                key={stateKey}
                onClick={() => setFilter(stateValue)}
                className={`px-4 py-2 rounded-full text-black ${statusColors[stateValue]} ${filter === stateValue ? 'font-bold' : ''}`}
              >
                {stateValue}
              </button>
            ))}
          </div>
        </div>
        {filteredParachains.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <GeneralTableWithButtons
              tableData={filteredParachains.map(({ paraId, state, network }, idx) => ({
                data: [
                  paraId.toString(),
                  network_list[network]?.paraId[paraId.toString()]?.name,
                  network_list[network]?.paraId[paraId.toString()]?.description,
                  <span key={idx} className={`${statusColors[state]} px-4 py-1 rounded-full`}>
                    {state}
                  </span>,
                  network_list[network]?.paraId[paraId.toString()]?.lease?.toString(),
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
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </Border>
  )
}

export default ParaIdFetch
