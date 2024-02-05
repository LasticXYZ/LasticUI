import PrimaryButton from '@/components/button/PrimaryButton'
import Modal from '@/components/modal/Modal'
import { truncateHash } from '@/utils/truncateHash'
import { encodeAddress } from '@polkadot/util-crypto'
import { TxButtonProps, useInkathon, useTxButton } from '@poppyseed/lastic-sdk'
import { FC, useState } from 'react'

interface AssignModalProps {
  isOpen: boolean
  onClose: () => void
  coreNb: string
  mask: string
  begin: string
}

interface RegionId {
  begin: string
  core: string
  mask: string
}

const AssignModal: FC<AssignModalProps> = ({ isOpen, onClose, coreNb, begin, mask }) => {
  const { api, activeSigner, activeAccount, activeChain } = useInkathon()
  const [task, setTask] = useState(0)
  const [finality, setFinality] = useState('Provisional');

  const regionId: RegionId = {
    begin: begin.replace(/,/g, ''),
    core: coreNb,
    mask: mask,
  }

  const txButtonProps: TxButtonProps = {
    api, // api is guaranteed to be defined here
    setStatus: (status: string | null) => console.log('tx status:', status),
    attrs: {
      palletRpc: 'broker',
      callable: 'assign',
      inputParams: [regionId, task, finality],
      paramFields: [
        { name: 'regionId', type: 'Object', optional: false },
        { name: 'task', type: 'Number', optional: false },
        { name: 'finality', type: 'String', optional: false}
      ],
    },
    type: 'SIGNED-TX',
    activeAccount,
    activeSigner,
  }

  const { transaction, status, allParamsFilled } = useTxButton(txButtonProps)

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Core Nb: ${coreNb} To Para ID`}
    >
      <div className="flex flex-col p-4">
        <div className="flex flex-col mb-4">
          <p className="text-lg font-semibold mb-2">Assing Core Nb: {coreNb}</p>
          <p className="text-lg mb-2">
            Account: {' '}
            {activeAccount
              ? truncateHash(encodeAddress(activeAccount.address, activeChain?.ss58Prefix || 42), 8)
              : 'error'}
          </p>
          <label htmlFor="task" className="text-lg font-semibold mb-2">
            To para ID:
          </label>
          <input
            id="task"
            className="text-lg border border-gray-300 rounded-md p-2 mb-4 focus:ring-blue-500 focus:border-blue-500"
            type="number"
            value={task}
            onChange={(e) => setTask(parseInt(e.target.value, 10))}
          />
          <label htmlFor="finality" className="text-lg font-semibold mb-2">
            Finality:
          </label>
            <select
                id="finality"
                className="text-lg border border-gray-300 rounded-md p-2 mb-4 focus:ring-blue-500 focus:border-blue-500"
                value={finality}
                onChange={(e) => setFinality(e.target.value)}
            >
                <option value="Provisional">Provisional</option>
                <option value="Final">Final</option>
            </select>
          <p className="text-lg mb-2">Region Begin: {begin}</p>
          <p className="text-md">Core Mask: {mask}</p>
        </div>
        <div className="flex justify-center pt-5">
          <PrimaryButton
            title="Assign Core"
            onClick={transaction}
            disabled={!allParamsFilled()}
          />
          <div className="mt-5 text-sm text-gray-16 ">{status}</div>
        </div>
      </div>
    </Modal>
  )
}

export default AssignModal
