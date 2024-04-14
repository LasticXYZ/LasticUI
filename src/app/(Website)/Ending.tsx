import PrimaryButtonWeb from '@/components/button/PrimaryButtonWeb'
import 'animate.css'
import Image from 'next/image'

const Ending = () => {
  return (
    <div
      id="home"
      className=" w-screen flex justify-center items-center border-t border-gray-16 bg-[#020710]"
    >
      <div className="w-full">
        {/* Text Section */}
        <div className="flex flex-col text-center items-center justify-center pt-10 md:pt-32 -mb-10 md:-mb-32 px-10 md:px-32 ">
          <h2 className=" leading-normal lg:leading-snug lg:max-w-4xl pt-10 py-4 text-white text-4xl md:text-6xl lg:text-7xl font-syne font-bold">
            Let&rsquo;s build the future together
          </h2>
          <div className="p-6">
            <PrimaryButtonWeb title="Get Started" location="/start" />
          </div>
        </div>

        {/* Image Section */}
        <div className="flex justify-end">
          <Image
            src="/assets/Images/ending-img.png"
            alt="hero"
            width={1000}
            height="0"
            style={{ width: '50%', height: 'auto' }}
            quality={100}
          />
        </div>
      </div>
    </div>
  )
}

export default Ending
