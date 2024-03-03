'use client'
import BoxesContainer from '@/components/activityBoxes/BoxesContainer'
import PrimaryButton from '@/components/button/PrimaryButton'
import Modal from '@/components/modal/Modal'
import { useRegionQuery } from '@/hooks/useRegionQuery'
import { RegionIdProps } from '@/types/broker'
import { useBrokerConstants } from '@/utils/broker'
import { TxButtonProps, blockTimeToUTC, useInkathon, useTxButton } from '@poppyseed/lastic-sdk'
import { FC, useEffect, useState } from 'react'


import {
  CoreMask,
  generateHexStringFromBooleans,
  getCoreMaskFromBits,
} from '../../../utils/common/commonFuncs'

/**
 *
 * TODO.
 *
 *
 */

interface InterlaceCoreModalProps {
  isOpen: boolean
  onClose: () => void
  regionId: RegionIdProps
}

type regionTimeSpan = {
  start: { region: number; blocknumber: number; utc: Date | null }
  end: { region: number; blocknumber: number; utc: Date | null }
}

const InterlaceCoreModal: FC<InterlaceCoreModalProps> = ({ isOpen, onClose, regionId }) => {
  const { api, activeSigner, activeAccount, activeChain, relayApi } = useInkathon()
  const { brokerConstants, isLoading: isConstantsLoading } = useBrokerConstants(api)

  const [selectedMask, setSelectedMask] = useState<CoreMask | undefined>(undefined)
  const [hexCoreMask, setHexCoreMask] = useState<string | undefined>('0x00000000000000000000')
  const regionData = useRegionQuery()
  const [regionTimeSpan, setRegionTimeSpan] = useState<regionTimeSpan>({
    start: { region: 0, blocknumber: 0, utc: null },
    end: { region: 0, blocknumber: 0, utc: null },
  })

  const txButtonProps: TxButtonProps = {
    api,
    setStatus: (status: string | null) => console.log('tx status:', status),
    attrs: {
      palletRpc: 'broker',
      callable: 'interlace',
      inputParams: [regionId, selectedMask],
      paramFields: [
        { name: 'region_id', type: 'Object', optional: false },
        { name: 'pivot', type: 'CoreMask', optional: false },
      ],
    },
    type: 'SIGNED-TX',
    activeAccount,
    activeSigner,
  }

  const { transaction, status, allParamsFilled } = useTxButton(txButtonProps)

  const updateMask = (bits: Array<boolean>) => {
    const mask = getCoreMaskFromBits(bits)
    setSelectedMask(mask)
    const hexCoreMask = generateHexStringFromBooleans(bits)
    setHexCoreMask('0x'+ hexCoreMask)
    console.log(hexCoreMask)
    console.log(mask)
  }


  /**
   * useEffect fetches the start and end times of the region and sets the regionTimeSpan state.
   */
  useEffect(() => {
    const fetchTimes = async () => {
      if (regionData && relayApi) {
        let timeslicePeriod = brokerConstants?.timeslicePeriod ?? 0

        // filter by core id, owner and region begin!
        let region = regionData.find(
          (r) =>
            r.detail[0].core === regionId.core &&
            r.owner.owner === activeAccount?.address &&
            r.detail[0].begin.replace(/,/g, '') === regionId.begin,
        )

        if (region) {
          let startBlock = Number(region.detail[0].begin.replace(/,/g, '')) * timeslicePeriod
          let endBlock = Number(region.owner.end.replace(/,/g, '')) * timeslicePeriod

          let regionStartString = await blockTimeToUTC(relayApi, startBlock)
          let regionEndString = await blockTimeToUTC(relayApi, endBlock)

          let coreStartUtc = regionStartString ? new Date(regionStartString) : null
          let coreEndUtc = regionEndString ? new Date(regionEndString) : null

          setRegionTimeSpan({
            start: { region: Number(regionId.begin), blocknumber: startBlock, utc: coreStartUtc },
            end: {
              region: Number(region.owner.end.replace(/,/g, '')),
              blocknumber: endBlock,
              utc: coreEndUtc,
            },
          })
        }
      }
    }

    fetchTimes()
  }, [regionData, relayApi])

  // TODO: take the start time from core
  const startTime = regionTimeSpan.start.utc || new Date('2023-01-01T01:00:00')
  const endTime = regionTimeSpan.end.utc || new Date('2023-01-01T11:40:00')
  // Size of each SquareBox
  const size: [number, number] = [40, 40]

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Create mask for Core NB: ${regionId.core} `}>
      <div className="flex flex-col p-4">
        <BoxesContainer
          startTime={startTime}
          endTime={endTime}
          size={size}
          onMaskUpdate={updateMask}
        />
        <div className="flex flex-col mb-4 mt-4">
          <p className="text-lg mb-2">Region Begin: {regionId.begin}</p>
          <p className="text-md">Current Core Mask: {regionId.mask}</p>
          <p className="text-md">New   &nbsp;  Core &nbsp; Mask : {hexCoreMask}</p>
        </div>
        <div className="flex justify-center pt-5">
          <PrimaryButton
            title="Interlace Core"
            onClick={transaction}
            disabled={!allParamsFilled()}
          />
          <div className="mt-5 text-sm text-gray-16 ">{status}</div>
        </div>
      </div>
    </Modal>
  )
}

export default InterlaceCoreModal
