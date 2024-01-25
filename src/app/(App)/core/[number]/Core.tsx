import Border from '@/components/border/Border'
import BrokerCoreDataExtensive from '@/components/broker/brokerCoreDataExtensive'
import React from 'react'

const MyCores: React.FC = () => {
  return (
    <Border className="h-full flex flex-row justify-center items-center">
      <BrokerCoreDataExtensive />
    </Border>
  )
}

export default MyCores
