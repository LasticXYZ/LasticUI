'use client'
import PrimaryButton from '@/components/button/PrimaryButton'
import Modal from '@/components/modal/Modal'
import { useRegionQuery } from '@/hooks/useRegionQuery'
import { RegionIdProps } from '@/types/broker'
import { useBrokerConstants } from '@/utils/broker'
import { MobileDateTimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import {
  CORETIME_CHAIN_BLOCK_TIME,
  RELAY_CHAIN_BLOCK_TIME,
  TxButtonProps,
  useInkathon,
  useTxButton,
} from '@poppyseed/lastic-sdk'
import { FC, useState } from 'react'

/**
 *
 * TODO. Still in progress!
 *
 *
 */

type RegionDetailItem = {
  begin: string
  core: string
  mask: string
}

type RegionDetail = RegionDetailItem[]

type RegionOwner = {
  end: string
  owner: string
  paid: string
}

type Region = {
  detail: RegionDetail
  owner: RegionOwner
}

type RegionsType = Region[]

interface PartitionCoreModalProps {
  isOpen: boolean
  onClose: () => void
  regionId: RegionIdProps
}

const PartitionCoreModal: FC<PartitionCoreModalProps> = ({ isOpen, onClose, regionId }) => {
  const { api, activeSigner, activeAccount, activeChain, relayApi } = useInkathon()
  const [pivot, setPivot] = useState<Date | undefined>()
  const txButtonProps: TxButtonProps = {
    api, // api is guaranteed to be defined here
    setStatus: (status: string | null) => console.log('tx status:', status),
    attrs: {
      palletRpc: 'broker',
      callable: 'partition',
      inputParams: [regionId, pivot],
      paramFields: [
        { name: 'regionId', type: 'Object', optional: false },
        { name: 'pivot', type: 'string', optional: false }, // unsure if string is correct
      ],
    },
    type: 'SIGNED-TX',
    activeAccount,
    activeSigner,
  }
  const { transaction, status, allParamsFilled } = useTxButton(txButtonProps)
  const { brokerConstants, isLoading: isConstantsLoading } = useBrokerConstants(api)
  const regionData = useRegionQuery()
  const filteredRegionDataByCoreNumber = regionData?.filter(
    (region) =>
      region.detail[0].core === regionId.core /* && region.detail[0].begin === regionId.begin */,
  )

  let blocktimeRelay = RELAY_CHAIN_BLOCK_TIME //ms
  let blocktimeCoretime = CORETIME_CHAIN_BLOCK_TIME //ms
  let timeslicePeriod = brokerConstants?.timeslicePeriod
  let coreStartBlock = (regionId.begin as unknown as number) * timeslicePeriod!
  console.log(filteredRegionDataByCoreNumber)
  /* let endBlock = filteredRegionDataByCoreNumber![0].owner.end */

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Split Core ${regionId.core} `}>
      <div className="flex flex-col p-4 ">
        <p className="font-semibold mb-4">Where do you want to split?</p>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MobileDateTimePicker
            disablePast
            label={'test'}
            orientation="landscape"
            /* minutesStep={timestep} */
            value={pivot}
            onChange={(newValue) => setPivot(newValue || undefined)}
          />
        </LocalizationProvider>

        <div className="flex justify-center pt-10">
          <PrimaryButton title="Split Core" onClick={transaction} disabled={!allParamsFilled()} />
          <div className="mt-5 text-sm text-gray-16 ">{status}</div>
        </div>
      </div>
    </Modal>
  )
}

export default PartitionCoreModal
