'use client'

import { useInkathon } from '@poppyseed/lastic-sdk'
import SubTitle from '../samesections/SubTitle'
import AnalyticSection from './AnalyticSection'
import MyCores from './ParaIdFetch'

const InstaCore = () => {
  const { activeAccount, activeRelayChain } = useInkathon()

  if (!activeAccount) {
    return (
      <>
        <SubTitle subtitle="Connect your wallet" />
        <AnalyticSection />
        <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 flex flex-col items-stretch">
          <MyCores />
        </section>
      </>
    )
  }

  return (
    <>
      <SubTitle subtitle={`Para Id Execution on ${activeRelayChain?.name}`} />{' '}
      {/* Corrected syntax */}
      <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 flex flex-col items-stretch mt-5">
        <MyCores />
      </section>
    </>
  )
}

export default InstaCore
