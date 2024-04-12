'use client'

import { Link } from '@mui/material'
import 'animate.css'
import { TypeAnimation } from 'react-type-animation'

const Hero = () => {
  return (
    <div id="home" className=" w-screen flex justify-center items-center bg-[#020710]">
      <div className="">
        {/* Text Section */}
        <div className="flex flex-col lg:flex-row items-center justify-center p-8 md:p-16 lg:p-32 ">
          <h2 className="h-[350px] md:h-[250px] md:px-0 w-[350px] md:w-[600px] leading-normal ml-5 md:ml-0 lg:leading-snug lg:max-w-3xl pt-10 text-white text-5xl md:text-6xl mt-10 md:mt-0 lg:text-6xl xl:text-7xl font-syne font-bold">
            <TypeAnimation
              // Same String at the start will only be typed once, initially
              sequence={[
                'The Modular Marketplace.',
                1000,
                'Trade resources builders need.',
                1000,
                'The Blockspace Marketplace.',
                1000,
                'Choose the right rewards.',
                1000,
                'Incentivize builders to adopt.',
                1000,
              ]}
              speed={55} // Custom Speed from 1-99 - Default Speed: 40
              wrapper="span" // Animation will be rendered as a <span>
              repeat={Infinity} // Repeat this Animation Sequence infinitely
            />
          </h2>
          <div className="px-10 md:max-w-sm xl:max-w-xl ml-14  sm:ml-32 lg:mt-20">
            <p className="py-5 font-dm_sans  text-gray-7 text-md xl:text-lg">
              One marketplace for all Modular solutions. A protocol-agnostic application that
              leverages the best features of major networks in order to provide the best service to
              builders and traders.
            </p>
            <div className="pt-4 xl:pt-5 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-2">
              <Link
                href="https://docs.lastic.xyz/"
                className=" text-pink-400 hover:text-pink-500 no-underline text-lg border-b border-pink-400 hover:border-pink-500 font-bold font-dm_sans"
              >
                Learn More -&gt;
              </Link>
            </div>
          </div>
        </div>

        {/* Image Section 
        <div className=" w-full px-10 lg:px-64">
          <Image
            src="/assets/Images/hero-img.png"
            alt="hero"
            layout="responsive"
            width={500}
            height={375}
            style={{ width: '80%', height: 'auto' }}
            quality={100}
            className="object-center justify-center items-center mx-auto "
          />
        </div>
        */}
        <div className="w-full px-10 lg:px-64">
          <video
            className="w-full h-auto mx-auto object-center justify-center items-center" // Adjust the Tailwind classes as needed
            loop
            muted
            autoPlay
          >
            <source src="/assets/Images/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
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
