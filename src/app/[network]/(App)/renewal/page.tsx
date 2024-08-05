'use client'

import { useInkathon } from '@poppyseed/lastic-sdk'
import SubTitle from '../samesections/SubTitle'
import PastTransactions from './PastTransactions'
import RenewFetch from './RenewFetch'
import TimeSection from './TimeSection'

const InstaCore = () => {
  const { activeAccount, activeRelayChain } = useInkathon()

  return (
    <>
      <SubTitle subtitle={`Renewals on ${activeRelayChain?.name}`} /> {/* Corrected syntax */}
      <TimeSection />
      <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 flex flex-col items-stretch mt-6">
        <RenewFetch />
      </section>
      <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 flex flex-col items-stretch">
        <PastTransactions />
      </section>
    </>
  )
}

export default InstaCore
