'use client'

import { useInkathon } from '@poppyseed/lastic-sdk'
import SubTitle from '../samesections/SubTitle'
import PastTransactions from './PastTransactions'
import RenewFetch from './RenewFetch'

const InstaCore = () => {
  const { activeAccount, activeRelayChain } = useInkathon()

  return (
    <>
      <SubTitle subtitle={`Renewals on ${activeRelayChain?.name}`} /> {/* Corrected syntax */}
      <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 flex flex-col items-stretch mt-5">
        <RenewFetch />
      </section>
      <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 flex flex-col items-stretch mt-5">
        <PastTransactions />
      </section>
    </>
  )
}

export default InstaCore
