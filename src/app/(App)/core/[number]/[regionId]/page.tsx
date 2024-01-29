'use client'

import SubTitle from '../../../samesections/SubTitle'
import Core from './Core'
import PastTransactions from './PastTransactions'

export default function PageCore({ params }: { params: { number: string, regionId: string } }) {
  const CoreNb = parseInt(params.number)
  return (
    <>
      <SubTitle subtitle={`A deeper look into the core Nb. ${params.number}`} />
      <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 flex flex-col items-stretch">
        <Core coreNb={CoreNb} regionId={params.regionId} />
        <PastTransactions />
      </section>
    </>
  )
}
  