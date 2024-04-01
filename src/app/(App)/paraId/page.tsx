'use client'

import { useInkathon } from '@poppyseed/lastic-sdk'
import SubTitle from '../samesections/SubTitle'
import ParaIdFetch from './ParaIdFetch'
import ParaIdRelay from './ParaIdRelay'
import ParachainsSubscanInfo from './ParachainsSubscanInfo'

const InstaCore = () => {
  const { activeRelayChain } = useInkathon()

  return (
    <>
      <SubTitle subtitle={`Para Id Execution on ${activeRelayChain?.name}`} />{' '}
      {/* Corrected syntax */}
      <ParachainsSubscanInfo />
      <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 flex flex-col items-stretch mt-5">
        <ParaIdRelay />
      </section>
      <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 flex flex-col items-stretch mt-5">
        <ParaIdFetch />
      </section>
    </>
  )
}

export default InstaCore
