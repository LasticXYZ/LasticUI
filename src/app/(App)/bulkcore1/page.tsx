'use client'

import SubTitle from '../samesections/SubTitle'
import CoreUtilisation from './CoreUtilisation'
import TimeSection from './TimeSection'

const BulkCore = () => {
  return (
    <>
      <SubTitle subtitle="Primary Bulk coretime market" />
      <TimeSection />

      <CoreUtilisation />
    </>
  )
}

export default BulkCore
