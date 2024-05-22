'use client'

import RegisterParaIDModal from '@/components/broker/extrinsics/registrar/RegisterParaIDModal'
import PrimaryButton from '@/components/button/PrimaryButton'
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
  const [isParaRegisterOpen, setIsParaRegisterOpen] = useState(false)

  const { nextParaId, reservationCost } = useParachainInfo()

  return (
    <>
      <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 flex flex-col items-stretch mt-5">
        <div className="flex flex-row items-start justify-between m">
          <h2 className="font-unbounded uppercase font-bold py-2 px-5 text-xl md:text-1xl xl:text-2xl">
            Para Id Execution on {network}
          </h2>
          <PrimaryButton title="Create New ParaId" onClick={() => setIsParaRegisterOpen(true)} />
        </div>
      </section>
      <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 flex flex-col items-stretch mt-5">
        <ParaIdFetch />
      </section>
      <ParachainsSubscanInfo />
      <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 flex flex-col items-stretch mt-5">
        <ParaIdRelay />
      </section>
      <RegisterParaIDModal
        isOpen={isParaRegisterOpen}
        nextParaId={nextParaId}
        reservationCost={reservationCost}
        onClose={() => setIsParaRegisterOpen(false)}
      />
    </>
  )
}

export default InstaCore
