import PrimaryButton from '@/components/button/PrimaryButton'
import Modal from '@/components/modal/Modal'
import { network_list } from '@/config/network'
import { useOwnedParaIds } from '@/hooks/useOwnedParaIds'
import { RegionIdProps } from '@/types/broker'
import { getChainFromPath } from '@/utils/common/chainPath'
import { truncateHash } from '@/utils/truncateHash'
import { encodeAddress } from '@polkadot/util-crypto'
import { TxButtonProps, useInkathon, useTxButton } from '@poppyseed/lastic-sdk'
import { usePathname } from 'next/navigation'
import { FC, useState } from 'react'

interface AssignModalProps {
  isOpen: boolean
  onClose: () => void
  regionId: RegionIdProps
}

const AssignModal: FC<AssignModalProps> = ({ isOpen, onClose, regionId }) => {
  const { api, activeSigner, activeAccount, activeChain, addToast } = useInkathon()
  const [task, setTask] = useState(0)
  const [finality, setFinality] = useState('Provisional')
  const [paraSearch, setParaSearch] = useState('')
  const pathname = usePathname()
  const network = getChainFromPath(pathname)
  const { ownedParaIds, loading: loadingOwnedParaIds } = useOwnedParaIds()

  const knownTaskName = Number.isFinite(task)
    ? network_list[network]?.paraId?.[task.toString()]?.name
    : null
  const filteredOwnedParaIds = ownedParaIds.filter(({ lifecycle, name, paraId }) => {
    const search = paraSearch.trim().toLowerCase()
    if (!search) return true
    return (
      paraId.toString().includes(search) ||
      name?.toLowerCase().includes(search) ||
      lifecycle?.toLowerCase().includes(search)
    )
  })

  const txButtonProps: TxButtonProps = {
    api, // api is guaranteed to be defined here
    setStatus: (status: string | null) => console.log('tx status:', status),
    addToast: addToast,
    attrs: {
      palletRpc: 'broker',
      callable: 'assign',
      inputParams: [regionId, task, finality],
      paramFields: [
        { name: 'regionId', type: 'Object', optional: false },
        { name: 'task', type: 'Number', optional: false },
        { name: 'finality', type: 'String', optional: false },
      ],
    },
    type: 'SIGNED-TX',
    activeAccount,
    activeSigner,
  }

  const { transaction, status, allParamsFilled } = useTxButton(txButtonProps)

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Assign Core Nb: ${regionId.core} To Para ID`}>
      <div className="flex flex-col p-4">
        <div className="flex flex-col mb-4">
          <p className="text-lg font-semibold mb-2">Assign Core Nb: {regionId.core}</p>
          <p className="text-lg mb-2">
            Account:{' '}
            {activeAccount
              ? truncateHash(encodeAddress(activeAccount.address, activeChain?.ss58Prefix || 42), 8)
              : 'error'}
          </p>
          <label htmlFor="task" className="text-lg font-semibold mb-2">
            To Para ID:
          </label>
          <div className="mb-4 rounded-md border border-gray-6 dark:border-gray-17 p-3">
            <div className="flex flex-col gap-2">
              <label htmlFor="para-search" className="text-sm font-semibold">
                Your ParaIds
              </label>
              <input
                id="para-search"
                className="text-md border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                type="text"
                value={paraSearch}
                onChange={(e) => setParaSearch(e.target.value)}
                placeholder="Search by ParaId, name, or lifecycle"
              />
              {loadingOwnedParaIds ? (
                <p className="text-sm text-gray-15">Loading your ParaIds...</p>
              ) : filteredOwnedParaIds.length > 0 ? (
                <div className="flex max-h-40 flex-col gap-2 overflow-y-auto">
                  {filteredOwnedParaIds.map(({ hasCode, lifecycle, name, paraId }) => (
                    <button
                      key={paraId}
                      type="button"
                      onClick={() => setTask(paraId)}
                      className={`rounded-md border px-3 py-2 text-left text-sm hover:bg-pink-50 hover:dark:bg-gray-22 ${
                        task === paraId ? 'border-pink-400 bg-pink-50 dark:bg-gray-22' : ''
                      }`}
                    >
                      <span className="font-semibold">
                        {paraId}
                        {name ? ` - ${name}` : ''}
                      </span>
                      <span className="block text-xs text-gray-14">
                        {[lifecycle, hasCode ? 'code uploaded' : 'no code']
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-15">
                  No owned ParaIds found. You can still enter a ParaId manually.
                </p>
              )}
            </div>
          </div>
          <input
            id="task"
            className="text-lg border rounded-md p-2 mb-4 focus:ring-blue-500 focus:border-blue-500"
            type="number"
            value={task}
            onChange={(e) => {
              const parsedTask = parseInt(e.target.value, 10)
              setTask(Number.isNaN(parsedTask) ? 0 : parsedTask)
            }}
          />
          {knownTaskName && <p className="text-sm text-gray-15 mb-4">Selected: {knownTaskName}</p>}
          <label htmlFor="finality" className="text-lg font-semibold mb-2">
            Finality:
          </label>
          <select
            id="finality"
            className="text-lg border rounded-md p-2 mb-4 focus:ring-blue-500 focus:border-blue-500"
            value={finality}
            onChange={(e) => setFinality(e.target.value)}
          >
            <option value="Provisional">Provisional</option>
            <option value="Final">Final</option>
          </select>
          <p className="text-md italic text-gray-18 dark:text-gray-4 mb-2">
            Note: If you have a full core it is better to choose Final Finality, if you do you will
            be able to renew your core.
          </p>
          <p className="text-lg mb-2">Region Begin: {regionId.begin}</p>
          <p className="text-md">Core Mask: {regionId.mask}</p>
        </div>
        <div className="flex justify-center pt-5">
          <PrimaryButton title="Assign Core" onClick={transaction} disabled={!allParamsFilled()} />
          {/* <div className="mt-5 text-sm text-gray-16 ">{status}</div> */}
        </div>
      </div>
    </Modal>
  )
}

export default AssignModal
