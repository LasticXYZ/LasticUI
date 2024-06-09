'use client'

import BorderBlack from '@/components/border/BorderBlack'
import PrimaryButtonWeb from '@/components/button/PrimaryButtonWeb'
import SecondaryButtonWeb from '@/components/button/SecondaryButtonWeb'
import Image from 'next/image'

const StartPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen my-2">
      {/* Container for the boxes */}
      <div className="grid grid-cols-1 mt-5 sm:grid-cols-2 gap-8 max-w-6xl mx-auto px-4 py-4 sm:p-4">
        {/* EVM Solution Box */}
        <BorderBlack>
          <div className="block text-current no-underline">
            <Image
              className="w-full h-60 object-cover rounded-t-lg"
              src="/assets/Images/cool-core3.webp"
              alt="polkadot solution"
              width={640}
              height={360}
              quality={75}
              priority={true}
            />
            <div className="py-8 px-6 flex flex-col justify-start items-start w-full">
              <h4 className="font-syne text-3xl py-2">Data Availability Marketplace</h4>
              <p className="font-dm_sans text-md text-gray-6 py-2 mb-5">
                Lastic&apos;s DA marketplace matches builders with incentives that foster the best
                solutions for each rollup or L2. Builders use a singlular API with a multi-chain
                solution and attract funding from crowd-funded incentives.
              </p>
              <div className="flex flex-col justify-center py-5 items-center w-full">
                <div className="p-2">
                  <PrimaryButtonWeb title="Launch App" location="https://ethprague.vercel.app/" />
                </div>
                <div className="p-2">
                  <SecondaryButtonWeb title="Read the Docs" location="https://docs.lastic.xyz/" />
                </div>
              </div>
            </div>
          </div>
        </BorderBlack>

        {/* Polkadot Solution Box */}
        <BorderBlack>
          <div className="block text-current no-underline">
            <Image
              className="w-full h-60 object-cover rounded-t-lg"
              src="/assets/Images/cool-core.webp"
              alt="polkadot solution"
              width={640}
              height={360}
              quality={75}
              priority={true}
            />
            <div className="py-8 px-6 flex flex-col justify-start items-start w-full">
              <h4 className="font-syne text-3xl py-2">Coretime Marketplace</h4>
              <p className="font-dm_sans text-md text-gray-6 py-2 mb-5">
                Join a new era where trading blockspace is as fluid as trading tokens. With Lastic,
                Appchains can leverage fully flexible on-demand onchain computation while brokers
                can trade blockspace with ease.
              </p>
              <div className="flex flex-col  py-5 justify-center items-center w-full">
                <div className="p-2">
                  <PrimaryButtonWeb title="Launch App" location="/kusama/bulkcore1" />
                </div>
                <div className="p-2">
                  <SecondaryButtonWeb title="Read the Docs" location="https://docs.lastic.xyz/" />
                </div>
              </div>
            </div>
          </div>
        </BorderBlack>
      </div>
    </div>
  )
}

export default StartPage
