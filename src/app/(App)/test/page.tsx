'use client'

import SubTitle from '../samesections/SubTitle'
import CoreUtilisation from './CoreUtilisationKSMDOT'
import ParachainInfo from './ParachainsInfo'

const BulkCore = () => {
  return (
    <>
      <SubTitle subtitle="Works with KSM and DOT" />
      <ParachainInfo />
      <CoreUtilisation />
    </>
  )
}

export default BulkCore
