// Dependencies
import PrimaryButtonWeb from '@/components/button/PrimaryButtonWeb'
import Image from 'next/image'

const FirstInfo = () => {
  return (
    <section className="flex flex-wrap my-10 md:my-32 md:flex-nowrap h-auto bg-black md:px-10 text-white">
      <div className="m-auto mt-10 px-10 sm:px-20 md:px-0 md:w-2/5 md:max-w-xl">
        {/* Text section */}
        <div className="flex flex-col space-y-4">
          <h6 className="uppercase text-md text-pink-4 font-bold font-inter">For Traders</h6>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight font-syne">
            Speculate on Resources Needed by Builders
          </h1>
          <p className="text-lg font-dm_sans text-gray-4">
            Looking for new opportunities and risks Seek platforms for predicting future demand
          </p>
          <div className="pt-8">
            <PrimaryButtonWeb title="Get Started" location="/bulkcore1" />
          </div>
        </div>
      </div>

      {/* Dashboard image or component goes here */}
      <div className="m-auto md:w-2/5 px-4 mt-10 md:mt-0 sm:px-4 py-8">
        <Image
          src="/assets/Images/trade-view.png"
          alt="Deeper Dive Image"
          layout="responsive"
          width={320}
          height={240}
        />
      </div>
    </section>
  )
}

export default FirstInfo
