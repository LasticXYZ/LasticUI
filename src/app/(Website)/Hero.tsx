'use client'

import { Link } from '@mui/material'
import 'animate.css'
import Image from 'next/image'
import { TypeAnimation } from 'react-type-animation'

const Hero = () => {
  return (
    <div id="home" className=" w-screen flex justify-center items-center bg-[#020710]">
      <div className="">
        {/* Text Section */}
        <div className="flex flex-col lg:flex-row items-center justify-center p-32 ">
          <h2 className="h-[250px] w-[600px] leading-normal lg:leading-snug lg:max-w-3xl pt-10 py-4 text-white text-5xl md:text-6xl lg:text-7xl font-syne font-bold">
            <TypeAnimation
              // Same String at the start will only be typed once, initially
              sequence={[
                'The Modular Marketplace.',
                1000,
                'The Blockspace Marketplace.',
                1000,
                'Trade Resources Devs Need.',
                1000,
                'Purchase Resources You Need.',
                1000,
              ]}
              speed={55} // Custom Speed from 1-99 - Default Speed: 40
              wrapper="span" // Animation will be rendered as a <span>
              repeat={Infinity} // Repeat this Animation Sequence infinitely
            />
          </h2>
          <div className="xl:max-w-xl ml-32 mt-10">
            <p className="py-14 font-dm_sans  text-gray-7 text-md xl:text-lg">
              One marketplace for All Modular Solutions. A protocol-agnostic application that
              leverages the best features of major networks in order to provide the best service to
              builders and traders.
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
            width={1000}
            height="0"
            style={{ width: '80%', height: 'auto' }}
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
