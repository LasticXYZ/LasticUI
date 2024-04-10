'use client'

import BorderBlack from '@/components/border/BorderBlack'
import PrimaryButtonWeb from '@/components/button/PrimaryButtonWeb'
import SecondaryButtonWeb from '@/components/button/SecondaryButtonWeb'
import Image from 'next/image'

const StartPage = () => {
    return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Container for the boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto p-4">
        {/* EVM Solution Box */}
        <div>
          <BorderBlack>
            <div className="flex flex-col  text-white font-bold py-6 px-12 rounded-lg shadow-lg items-center justify-center transition-all duration-300">
              <Image
                src="/assets/Images/deeper_dive.png"
                width={130}
                height={0}
                className="rounded-2xl border border-gray-16 "
                style={{ width: '10em', height: 'auto' }}
                quality={100}
                alt="Lastic Logo"
              />
              <p className="text-xl">EVM Solution</p>
              <p>If you have a Layer One</p>
              <PrimaryButtonWeb title="Go to App" onClick={() => console.log("test")} disabled={true}/>
              <SecondaryButtonWeb title="Check the Docs" location='https://docs.lastic.xyz/'  />
            </div>
          </BorderBlack>
        </div>

        {/* Polkadot Solution Box */}
        <div>
          <BorderBlack>
            <div className="flex flex-col  text-white font-bold py-6 px-12 rounded-lg shadow-lg cursor-pointer items-center justify-center transition-all duration-300">
              <Image
                src="/assets/Images/deeper_dive.png"
                width={130}
                height={0}
                className="rounded-2xl border border-gray-16 "
                style={{ width: '10em', height: 'auto' }}
                quality={100}
                alt="Lastic Logo"
              />
                <p className="text-xl">Polkadot Solution</p>
                <p>If you have an Appchain</p>
                <PrimaryButtonWeb title="Go to App" location="/bulkcore1" />
                <SecondaryButtonWeb title="Check the Docs" location='https://docs.lastic.xyz/'  />
            </div>
          </BorderBlack>
        </div>
      </div>
    </div>
  )
}

export default StartPage
