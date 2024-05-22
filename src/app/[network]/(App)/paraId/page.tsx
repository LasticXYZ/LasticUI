'use client'

import RegisterParaIDModal from '@/components/broker/extrinsics/registrar/RegisterParaIDModal'
import ReserveParaIDModal from '@/components/broker/extrinsics/registrar/ReserveParaIDModal'
import PrimaryButton from '@/components/button/PrimaryButton'
import SecondaryButton from '@/components/button/SecondaryButton'
import { useParachainInfo } from '@/hooks/useParachainInfo'
import { getChainFromPath } from '@/utils/common/chainPath'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import ParaIdFetch from './ParaIdFetch'
import ParaIdRelay from './ParaIdRelay'
import ParachainsSubscanInfo from './ParachainsSubscanInfo'

const InstaCore = () => {
  const pathname = usePathname()
  const network = getChainFromPath(pathname)
  const [isParaReserveOpen, setIsParaReserveOpen] = useState(false)
  const [isParaRegisterOpen, setIsParaRegisterOpen] = useState(false)

  const { nextParaId, reservationCost, dataDepositPerByte, maxCodeSize } = useParachainInfo()

  return (
    <>
      <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 flex flex-col items-stretch mt-5">
        <div className="flex flex-row items-start justify-between m">
          <h2 className="font-unbounded uppercase font-bold py-2 px-5 text-xl md:text-1xl xl:text-2xl">
            Execution on {network}
          </h2>
          <div className="flex flex-row justify-center items-center">
            <PrimaryButton title="Create New ParaId" onClick={() => setIsParaReserveOpen(true)} />
            <SecondaryButton title="Register ParaId" onClick={() => setIsParaRegisterOpen(true)} />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 flex flex-col items-stretch mt-5">
        <ParaIdFetch />
      </section>
      <ParachainsSubscanInfo />
      <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 flex flex-col items-stretch mt-5">
        <ParaIdRelay />
      </section>
      <ReserveParaIDModal
        isOpen={isParaReserveOpen}
        nextParaId={nextParaId}
        reservationCost={reservationCost}
        onClose={() => setIsParaReserveOpen(false)}
      />
      <RegisterParaIDModal
        isOpen={isParaRegisterOpen}
        dataDepositPerByte={dataDepositPerByte}
        maxCodeSize={maxCodeSize}
        onClose={() => setIsParaRegisterOpen(false)}
      />
    </>
  )
}

export default InstaCore
