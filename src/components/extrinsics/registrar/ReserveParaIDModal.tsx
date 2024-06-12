import PrimaryButton from '@/components/button/PrimaryButton'
import Modal from '@/components/modal/Modal'
import { formatPrice } from '@/utils'
import { getChainFromPath } from '@/utils/common/chainPath'
import { truncateHash } from '@/utils/truncateHash'
import { encodeAddress } from '@polkadot/util-crypto'
import { TxButtonProps, useInkathon, useTxButton } from '@poppyseed/lastic-sdk'
import { usePathname } from 'next/navigation'
import { FC } from 'react'

interface TransferModalProps {
  isOpen: boolean
  nextParaId: number
  reservationCost: string
  onClose: () => void
}

const ReserveParaIDModal: FC<TransferModalProps> = ({
  isOpen,
  nextParaId,
  reservationCost,
  onClose,
}) => {
  const { relayApi, activeSigner, activeAccount, activeChain, addToast } = useInkathon()
  const pathname = usePathname()
  const network = getChainFromPath(pathname)

  const txButtonProps: TxButtonProps = {
    api: relayApi, // api is guaranteed to be defined here
    setStatus: (status: string | null) => console.log('tx status:', status),
    addToast: addToast,
    attrs: {
      palletRpc: 'registrar',
      callable: 'reserve',
      inputParams: [],
      paramFields: [],
    },
    type: 'SIGNED-TX',
    activeAccount,
    activeSigner,
  }

  const { transaction, status, allParamsFilled } = useTxButton(txButtonProps)

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reserve a new ParaID`}>
      <div className="flex flex-col p-4">
        <div className="flex flex-col mb-4">
          <p className="text-lg font-semibold mb-2">
            Reserved Deposit: {formatPrice(reservationCost, network)}
          </p>
          <p className="text-lg font-semibold mb-2">Next ParaID: {nextParaId}</p>

          <p className="text-lg mb-2">
            Reserve with account:{' '}
            {activeAccount
              ? truncateHash(
                  encodeAddress(activeAccount.address, activeChain?.ss58Prefix || 42),
                  10,
                )
              : 'error'}
          </p>
        </div>
        <div className="flex justify-center pt-5">
          <PrimaryButton
            title="Reserve ParaID"
            onClick={transaction}
            disabled={!allParamsFilled()}
          />
        </div>
        {/* <div className="mt-5 text-sm text-gray-16 ">{status}</div> */}
      </div>
    </Modal>
  )
}

export default ReserveParaIDModal
