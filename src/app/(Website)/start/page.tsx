'use client'

import BorderBlack from '@/components/border/BorderBlack'
import PrimaryButtonWeb from '@/components/button/PrimaryButtonWeb'
import SecondaryButtonWeb from '@/components/button/SecondaryButtonWeb'
import Image from 'next/image'

const StartPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 my-10">
      {/* Container for the boxes */}
      <div className="grid grid-cols-1 mt-16 sm:grid-cols-2 gap-8 max-w-6xl mx-auto px-4 py-8 sm:p-4">
        {/* EVM Solution Box */}
        <div>
          <BorderBlack>
            <div className="flex flex-col text-white font-bold py-6 px-12 rounded-lg shadow-lg items-center justify-center transition-all duration-300">
              <Image
                src="/assets/Images/deeper_dive.png"
                width={250}
                height={250}
                className="rounded-2xl border border-gray-16 "
                layout="responsive"
                quality={100}
                alt="Lastic Logo"
              />
              <div className="py-5 px-2 flex flex-col justify-start items-start w-full">
                <h4 className="font-syne text-3xl py-2">EVM solution</h4>
                <p className="font-dm_sans text-md text-gray-6 py-2 mb-5">
                  Explore Lastic&apos;s versatile marketplace, tailored for EVM-compatible Layer One
                  blockchains. Experience efficiency like never before with services optimized for
                  Data Availability and Co-Processing.
                </p>
                <div className="flex flex-col justify-center items-center w-full">
                  <div className="p-2">
                    <PrimaryButtonWeb
                      title="Coming Soon"
                      onClick={() => console.log('test')}
                      disabled={true}
                    />
                  </div>
                  <div className="p-2">
                    <SecondaryButtonWeb
                      title="Check the Docs"
                      location="https://docs.lastic.xyz/"
                    />
                  </div>
                </div>
              </div>
            </div>
          </BorderBlack>
        </div>

        {/* Polkadot Solution Box */}
        <div>
          <BorderBlack>
            <div className="flex flex-col  text-white font-bold py-6 px-12 rounded-lg shadow-lg items-center justify-center transition-all duration-300">
              <Image
                src="/assets/Images/deeper_dive.png"
                width={250}
                height={250}
                className="rounded-2xl w-[300px] border border-gray-16 "
                layout="responsive"
                quality={100}
                alt="Lastic Logo"
              />
              <div className="py-5 px-2 flex flex-col justify-start items-start w-full">
                <h4 className="font-syne text-3xl py-2">Polkadot solution</h4>
                <p className="font-dm_sans text-md text-gray-6 py-2 mb-5">
                  Join a new era where trading blockspace is as fluid as trading tokens. With
                  Lastic, your Appchain can leverage on-chain computation and speculative
                  instruments to maximize efficiency and growth.
                </p>
                <div className="flex flex-col justify-center items-center w-full">
                  <div className="p-2">
                    <PrimaryButtonWeb title="Go to App" location="/bulkcore1" />
                  </div>
                  <div className="p-2">
                    <SecondaryButtonWeb
                      title="Check the Docs"
                      location="https://docs.lastic.xyz/"
                    />
                  </div>
                </div>
              </div>
            </div>
          </BorderBlack>
        </div>
      </div>
    </div>
  )
}

export default StartPage
