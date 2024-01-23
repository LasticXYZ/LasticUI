// components/TimeComponent.tsx

import Border from '@/components/border/Border'
import React from 'react'
import BrokerSaleInfo from '@/components/broker/brokerSaleInfo'

const TimeSection: React.FC = () => {
  return (
    <section className="mx-auto max-w-9xl px-4 mt-5 sm:px-6 lg:px-8">
      <Border>
        <BrokerSaleInfo />
        <div className="mb-4 p-10">
          <button className="font-bold">
            <span className="text-pink-4">◀</span> previous coretime sale
          </button>
          <div className="flex justify-between rounded-full mx-10 bg-pink-4 px-16 py-10 bg-opacity-30 items-center my-6">
            <div className="text-xl font-bold font-syncopate text-gray-21">Renewal period</div>
            <div className="text-2xl font-bold font-syncopate text-gray-18">
              02 days 08 hrs 41 mins 57 sec
            </div>
          </div>
          <div className="flex justify-between items-center border-b-2 border-gray-9 pb-4">
            <span>Renewal Period Starts</span>
            <span>Coretime Sale Starts</span>
            <span>Coretime Utilization Starts</span>
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-red-500">● Renewal/Interlude period - 7 days</span>
            <span className="text-red-500">● Coretime sales period - 7 days</span>
            <span className="text-red-500">● Utilization period - 28 days</span>
          </div>
        </div>
      </Border>
    </section>
  )
}

export default TimeSection
