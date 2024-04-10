'use client'

import PrimaryButtonWeb from '@/components/button/PrimaryButtonWeb'
import 'animate.css'
import Image from 'next/image'

const Ending = () => {
  return (
    <div
      id="home"
      className="w-screen flex flex-col lg:flex-row justify-center items-center border-t border-gray-16 bg-[#020710]"
    >
      <div className="w-full">
        {/* Text Section */}
        <div className="flex flex-col text-center items-center justify-center pt-16 lg:pt-32 -mb-16 lg:-mb-32 px-8 lg:px-32 ">
          <h2 className="leading-normal lg:leading-snug lg:max-w-4xl pt-10 py-4 text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-syne font-bold">
            Let&rsquo;s build the future together
          </h2>
          <div className="p-6">
            <PrimaryButtonWeb />
          </div>
        </div>

        {/* Image Section */}
        <div className="flex justify-center lg:justify-end pb-16 lg:pb-0">
          <Image
            src="/assets/Images/ending-img.png"
            alt="hero"
            layout="intrinsic"
            width={500}
            height={300}
            objectFit="contain"
            quality={100}
          />
        </div>
      </div>
    </div>
  )
}

export default Ending
