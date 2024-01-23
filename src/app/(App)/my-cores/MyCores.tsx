import Border from '@/components/border/Border'
import BrokerRegionData from '@/components/broker/brokerRegions'
import React from 'react'

const MyCores: React.FC = () => {
  return (
    <Border className="h-full flex flex-row justify-center items-center">
      <BrokerRegionData />
    </Border>
  )
}

export default MyCores
