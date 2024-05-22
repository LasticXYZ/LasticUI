import PrimaryButton from '@/components/button/PrimaryButton'
import Modal from '@/components/modal/Modal'
import { RegionIdProps } from '@/types/broker'
import { parseNativeTokenToHuman } from '@/utils'
import { truncateHash } from '@/utils/truncateHash'
import { encodeAddress } from '@polkadot/util-crypto'
import { TxButtonProps, useInkathon, useTxButton } from '@poppyseed/lastic-sdk'
import { FC } from 'react'

interface RenewModalProps {
  isOpen: boolean
  onClose: () => void
  task: string
  price: string
  tokenSymbol: string
  regionId: RegionIdProps
}

const RenewModal: FC<RenewModalProps> = ({
  isOpen,
  onClose,
  task,
  price,
  tokenSymbol,
  regionId,
}) => {
  const { api, activeSigner, activeAccount, activeChain } = useInkathon()

  const txButtonProps: TxButtonProps = {
    api, // api is guaranteed to be defined here
    setStatus: (status: string | null) => console.log('tx status:', status),
    attrs: {
      palletRpc: 'broker',
      callable: 'renew',
      inputParams: [regionId.core],
      paramFields: [{ name: 'core', type: 'string', optional: false }],
    },
    type: 'SIGNED-TX',
    activeAccount,
    activeSigner,
  }

  const { transaction, status, allParamsFilled } = useTxButton(txButtonProps)

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Renew ParaID ${task}`}>
      <div className="flex flex-col p-4">
        <div className="flex flex-col mb-4">
          <p className="text-lg font-semibold mb-2">
            Price: {parseNativeTokenToHuman({ paid: price, decimals: 12, reduceDecimals: 6 })}{' '}
            {tokenSymbol}
          </p>
          <p className="text-lg font-semibold mb-2">Para ID: {task}</p>
          <p className="text-lg font-semibold mb-2">Renew Core Nb: {regionId.core}</p>
          <p className="text-lg mb-2">Region Begin: {regionId.begin}</p>
          <p className="text-lg">
            You:{' '}
            {activeAccount
              ? truncateHash(encodeAddress(activeAccount.address, activeChain?.ss58Prefix || 42), 8)
              : 'error'}
          </p>
        </div>
        <div className="flex justify-center pt-5">
          <PrimaryButton title="Renew Core" onClick={transaction} disabled={!allParamsFilled()} />
        </div>
        <div className="mt-5 text-sm text-gray-16 ">{status}</div>
      </div>
    </Modal>
  )
}

export default RenewModal
