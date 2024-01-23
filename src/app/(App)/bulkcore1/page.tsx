'use client'

import SubTitle from '../samesections/SubTitle'
import AnalyticSection from './AnalyticSection'
import TimeSection from './TimeSection'
import CoreUtilisation from './CoreUtilisation'
import BuyCores from './BuyCores'

const BulkCore = () => {
  return (
    <>
      <SubTitle subtitle="Primary Bulk coretime market" />
      <TimeSection />
      <section className="mx-auto max-w-9xl py-4 px-4 sm:px-6 lg:px-8 flex flex-col items-stretch">
        <div className="grid grid-cols-4 gap-8 flex-grow">
          <div className="col-span-1 flex flex-col items-stretch w-full">
            <AnalyticSection />
          </div>
          <div className="col-span-3 py-4">
            <BuyCores />
          </div>
        </div>
      </section>

      <CoreUtilisation />
    </>
  )
}

export default BulkCore
