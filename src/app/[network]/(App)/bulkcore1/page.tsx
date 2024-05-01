'use client'

import PastCoresSold from '@/app/[network]/(App)/bulkcore1/PastCoresSold'
import SubTitle from '../samesections/SubTitle'
import CoreUtilisation from './CoreUtilisation'
import TimeSection from './TimeSection'

const BulkCore = () => {
  return (
    <>
      <SubTitle subtitle="Primary Bulk coretime market" />
      <TimeSection />

      <CoreUtilisation />
      <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 flex flex-col items-stretch mt-8">
        <PastCoresSold />
      </section>
    </>
  )
}

export default BulkCore
