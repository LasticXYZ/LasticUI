import { Link } from '@mui/material'
import Image from 'next/image'

const Hero = () => {
  return (
    <div id="home" className=" w-screen flex justify-center items-center bg-[#020710]">
      <div className="">
        {/* Text Section */}
        <div className="flex flex-col lg:flex-row items-center justify-center p-20 ">
          <h2 className="leading-normal lg:leading-snug lg:max-w-2xl pt-20 py-4 text-white text-5xl md:text-6xl lg:text-8xl font-syne font-bold">
            The Modular Marketplace.
          </h2>
          <div className="xl:max-w-xl ml-32 mt-10">
            <p className="py-4 font-dm_sans  text-gray-7 text-md xl:text-lg">
              Start harnessing the full potential of decentralized finance with the most advanced
              platform in the world.
            </p>
            <div className="pt-8 xl:pt-10 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-2">
              <Link
                href="https://docs.lastic.xyz/"
                className=" text-purple-6 hover:text-pink-4 no-underline text-lg border-b font-bold font-dm_sans"
              >
                Learn More -&gt;
              </Link>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className=" w-full ">
          <Image
            src="/assets/Images/hero-img.png"
            alt="hero"
            width={1002}
            height={1092}
            quality={100}
            className="object-center justify-center items-center mx-auto "
          />
        </div>
      </div>
    </div>
  )
}

export default Hero

/* Social Icons 
  <div className="flex items-center justify-center lg:justify-start pt-8 xl:pt-10 space-x-4">
    <Link
      href="https://github.com/LasticXYZ/Lastic"
      target="_blank"
      rel="noreferrer"
      legacyBehavior
    >
      <div className="rounded-full border border-gray-9 shadow-gray-900 p-4 cursor-pointer hover:scale-110 ease-in duration-300">
        <FaGithub />
      </div>
    </Link>
    <Link
      href="https://twitter.com/lastic_xyz"
      target="_blank"
      rel="noreferrer"
      legacyBehavior
    >
      <div className="rounded-full border border-gray-9 shadow-gray-900 p-4 cursor-pointer hover:scale-110 ease-in duration-300">
        <FaTwitter />
      </div>
    </Link>
    <Link
      href="https://medium.com/lastic-marketplace"
      target="_blank"
      rel="noreferrer"
      legacyBehavior
    >
      <div className="rounded-full border border-gray-9 shadow-gray-900 p-4 cursor-pointer hover:scale-110 ease-in duration-300 ">
        <FaMedium />
      </div>
    </Link>
    <Link
      href="https://t.me/+khw2i6GGYFw3NDNi"
      target="_blank"
      rel="noreferrer"
      legacyBehavior
    >
      <div className="rounded-full border border-gray-9 shadow-gray-900 p-4 cursor-pointer hover:scale-110 ease-in duration-300 ">
        <FaTelegram />
      </div>
    </Link>
  </div>
    */
