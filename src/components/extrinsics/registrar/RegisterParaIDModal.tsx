import PrimaryButton from '@/components/button/PrimaryButton'
import NumberField from '@/components/inputField/NumberField'
import InputFile from '@/components/inputFile/InputFile'
import Modal from '@/components/modal/Modal'
import { formatPrice } from '@/utils'
import { getChainFromPath } from '@/utils/common/chainPath'
import { truncateHash } from '@/utils/truncateHash'
import { ArrowUpOnSquareIcon, CodeBracketIcon } from '@heroicons/react/24/solid'
import { compactAddLength } from '@polkadot/util'
import { encodeAddress } from '@polkadot/util-crypto'
import { TxButtonProps, useInkathon, useTxButton } from '@poppyseed/lastic-sdk'
import { usePathname } from 'next/navigation'
import { FC, useState } from 'react'

interface TransferModalProps {
  isOpen: boolean
  dataDepositPerByte: bigint
  maxCodeSize: bigint
  onClose: () => void
}

const ReserveParaIDModal: FC<TransferModalProps> = ({
  isOpen,
  dataDepositPerByte,
  maxCodeSize,
  onClose,
}) => {
  const { relayApi, activeSigner, activeAccount, activeChain, addToast } = useInkathon()
  const pathname = usePathname()
  const network = getChainFromPath(pathname)
  const [genesisHead, setGenesisHead] = useState<Uint8Array>()
  const [wasmCode, setWasmCode] = useState<Uint8Array>()
  const [paraId, setParaId] = useState<number | null>(null)

  const registrationCost = dataDepositPerByte * (BigInt(genesisHead?.length ?? 0) + maxCodeSize)

  const txButtonProps: TxButtonProps = {
    api: relayApi,
    setStatus: (status: string | null) => console.log('tx status:', status),
    addToast: addToast,
    attrs: {
      palletRpc: 'registrar',
      callable: 'register',
      inputParams: [
        paraId ? paraId : undefined,
        genesisHead ? compactAddLength(genesisHead) : undefined,
        wasmCode ? compactAddLength(wasmCode) : undefined,
      ],
      paramFields: [
        { name: 'id', type: 'u32', optional: false },
        { name: 'genesisHead', type: 'Bytes', optional: false },
        { name: 'validationCode', type: 'Bytes', optional: false },
      ],
    },
    type: 'SIGNED-TX',
    activeAccount,
    activeSigner,
  }

  const { transaction, status, allParamsFilled } = useTxButton(txButtonProps)

  // Check if genesisHead and wasmCode are defined and non-empty
  const canSubmitTransaction = () => {
    return genesisHead && genesisHead.length > 0 && wasmCode && wasmCode.length > 0
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register your Parachain">
      <div className="flex flex-col p-4 space-y-4 text-blackdark:text-white rounded-lg">
        <div className="flex flex-col">
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
        <div className="mb-4">
          Registration Cost: {formatPrice(registrationCost.toString(), network)}
        </div>
        <NumberField
          label="Parachain Id:"
          value={paraId || ''}
          onChange={(e) => setParaId(parseFloat(e.target.value) || null)}
        />
        <InputFile
          label="Upload WASM validation function for this parachain."
          icon={<CodeBracketIcon className="h-5 w-5 text-gray-500" />}
          onChange={(data) => setWasmCode(data)}
          onCancel={() => setWasmCode(new Uint8Array())}
        />
        <InputFile
          label="Genesis Head - Upload the state for this parachain."
          icon={<ArrowUpOnSquareIcon className="h-5 w-5 text-gray-500" />}
          onChange={(data) => setGenesisHead(data)}
          onCancel={() => setGenesisHead(new Uint8Array())}
        />
        <div className="flex justify-center pt-5">
          <PrimaryButton
            title="Register Your Parachain"
            onClick={transaction}
            disabled={!canSubmitTransaction()}
          />
        </div>
        {/* <div className="mt-5 text-sm text-gray-400">{status}</div> */}
      </div>
    </Modal>
  )
}

export default ReserveParaIDModal
