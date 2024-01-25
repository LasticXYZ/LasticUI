'use client'

import SubTitle from '../../samesections/SubTitle'
import Core from './Core'
import PastTransactions from './PastTransactions'
import TimeSection from './TimeSection'

const InstaCore = () => {
  return (
    <>
      <SubTitle subtitle="A deeper look into the core"/>
      <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 flex flex-col items-stretch">
        <Core />
        <TimeSection />
        <PastTransactions />
      </section>
    </>
  )
}

export default InstaCore
