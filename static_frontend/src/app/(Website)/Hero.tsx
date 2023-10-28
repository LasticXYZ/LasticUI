import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { FaGithub, FaTelegram, FaTwitter, FaMedium } from 'react-icons/fa';
import SecondaryButton from '@/components/button/SecondaryButton';
import PrimaryButton from '@/components/button/PrimaryButton';

const Hero = () => {
  return (
    <div id='home' className="h-screen w-screen flex justify-center items-center">
      <div className='flex flex-col md:flex-row xl:justify-between items-center w-full max-w-7xl px-4 md:px-0'>

      {/* Text Section */}
      <div className='w-full md:max-w-lg text-center md:text-left mf:px-5 lg:max-w-2xl py-20 mx-auto p-2 relative z-10'>
        <div>
          <h2 className='pt-20 py-4 text-gray-17 text-3xl sm:4xl xl:text-5xl font-syncopate font-bold'>
            the world&apos;s first  
            <span className='leading-relaxed px-3 text-transparent bg-clip-text bg-gradient-to-r from-lastic-spectrum-from via-lastic-spectrum-via to-lastic-spectrum-to'>blockspace</span> marketplace.
          </h2>
          <p className='py-4 text-montserrat xl:max-w-md text-gray-8 text-lg xl:text-xl'>
          Do anything you want with your blockspace
          </p>
          <div className='pt-8 xl:pt-10 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4'>
              <PrimaryButton title='Launch' location='/instacore'/>
              <SecondaryButton title='See Whitepaper' location='/instacore'/>
          </div>
        </div>
        <div className='flex items-center justify-center md:justify-start pt-8 xl:pt-10 space-x-4'>
          <Link
            href='https://github.com/LasticXYZ/Lastic'
            target='_blank'
            rel='noreferrer'
            legacyBehavior>
            <div className='rounded-full border border-gray-9 shadow-gray-900 p-4 cursor-pointer hover:scale-110 ease-in duration-300 mr-4'>
              <FaGithub />
            </div>
          </Link>
          <Link
            href='https://twitter.com/lastic_xyz'
            target='_blank'
            rel='noreferrer'
            legacyBehavior>
            <div className='rounded-full border border-gray-9 shadow-gray-900 p-4 cursor-pointer hover:scale-110 ease-in duration-300 mr-4'>
              <FaTwitter />
            </div>
          </Link>
          <Link
            href='https://medium.com/lastic-marketplace'
            target='_blank'
            rel='noreferrer'
            legacyBehavior>
            <div className='rounded-full border border-gray-9 shadow-gray-900 p-4 cursor-pointer hover:scale-110 ease-in duration-300 mr-4'>
              <FaMedium />
            </div>
          </Link>
          <Link
            href='https://t.me/+khw2i6GGYFw3NDNi'
            target='_blank'
            rel='noreferrer'
            legacyBehavior>
            <div className='rounded-full border border-gray-9 shadow-gray-900 p-4 cursor-pointer hover:scale-110 ease-in duration-300 mr-4'>
              <FaTelegram />
            </div>
          </Link>
        </div>
      </div>

        {/* Image Section */}
        <div className="w-11/12 xl:w-1/2 mx-auto md:mx-0 relative z-10">
          <Image
            src='/assets/Images/hero-page.png'
            alt='hero'
            width={700}
            height={700}
            quality={100}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;

