import { RegionId } from '@/types/broker'
import { encodeAddress } from '@polkadot/util-crypto'
import { TxButtonProps, useInkathon, useTxButton } from '@poppyseed/lastic-sdk'
import { useCallback, useState } from 'react'

interface UseTransferExtrinsicProps {
  regionId: RegionId
}

const useTransferExtrinsic = ({ regionId }: UseTransferExtrinsicProps) => {
  const { api, activeSigner, activeAccount, activeChain, addToast } = useInkathon()
  const [newOwner, setNewOwner] = useState('')

  const txButtonProps: TxButtonProps = {
    api, // api is guaranteed to be defined here
    setStatus: (status: string | null) => console.log('tx status:', status),
    addToast: addToast,
    attrs: {
      palletRpc: 'broker',
      callable: 'transfer',
      inputParams: [regionId, newOwner],
      paramFields: [
        { name: 'regionId', type: 'Object', optional: false },
        { name: 'newOwner', type: 'String', optional: false },
      ],
    },
    type: 'SIGNED-TX',
    activeAccount,
    activeSigner,
  }

  const { transaction, status, allParamsFilled } = useTxButton(txButtonProps)

  const handleNewOwnerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewOwner(e.target.value)
  }, [])

  const fromAddress = activeAccount
    ? truncateHash(encodeAddress(activeAccount.address, activeChain?.ss58Prefix || 42), 8)
    : 'error'

  return {
    newOwner,
    setNewOwner,
    transaction,
    status,
    allParamsFilled,
    handleNewOwnerChange,
    fromAddress,
  }
}

export default useTransferExtrinsic
