'use client'
import Image from 'next/image'

export default function FuturePlatform() {
  return (
    <div className="overflow-hidden border-y border-gray-16">
      <div className="">
        <div className="mx-auto max-w-9xl py-10 md:py-28 px-2 sm:px-6 lg:px-8">
          <div className="flex flex-row justify-center items-center gap-5 md:p-14">
            <div className="max-w-2xl md:text-center px-6 py-10 ">
              <h6 className="uppercase text-md py-3 text-pink-400 font-bold font-inter">
                The revolution
              </h6>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight font-syne">
                Bringing Retail and Builders together.
              </h1>
              <p className="text-lg font-dm_sans py-6 text-gray-8">
                Incentivize builders. Secure future blockspace. Trade Blockspace. Get Early Appchain
                Rewards.
              </p>
            </div>
          </div>
          <div className="mx-auto w-full">
            <Image
              src="/assets/Images/application.png"
              alt="Deeper Dive Image"
              width={1040}
              height={480}
              className="mx-auto w-full"
              quality={100}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
