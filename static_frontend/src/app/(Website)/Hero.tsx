import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { FaGithub, FaTelegram, FaTwitter, FaMedium } from 'react-icons/fa';
import SecondaryButton from '@/components/button/SecondaryButton';
import PrimaryButton from '@/components/button/PrimaryButton';

const Hero = () => {
  return (
    <div id='home' className=" w-screen flex justify-center items-center">
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:justify-between items-center w-full px-4 md:px-0'>

        {/* Text Section */}
        <div className='lg:pl-20 2xl:pl-48 w-full text-center lg:text-left md:px-5 max-w-4xl pt-15 pb-4 md:py-20 mx-auto p-2 relative z-10'>
          <div>
            <h2 className='leading-normal lg:leading-snug pt-20 py-4 text-gray-17 text-3xl md:text-4xl lg:text-5xl font-syncopate font-bold'>
              the world&apos;s first 
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-lastic-spectrum-from via-lastic-spectrum-via to-lastic-spectrum-to'> blockspace </span>
              marketplace.
            </h2>
            <p className='py-4 text-montserrat xl:max-w-md text-gray-8 text-lg xl:text-xl'>
            Do anything you want with your blockspace
            </p>
            <div className='pt-8 xl:pt-10 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-2'>
                <PrimaryButton title='Coming Soon' location='/'/>
            </div>
          </div>
          {/* Social Icons */}
          <div className='flex items-center justify-center lg:justify-start pt-8 xl:pt-10 space-x-4'>
            <Link
              href='https://github.com/LasticXYZ/Lastic'
              target='_blank'
              rel='noreferrer'
              legacyBehavior>
              <div className='rounded-full border border-gray-9 shadow-gray-900 p-4 cursor-pointer hover:scale-110 ease-in duration-300'>
                <FaGithub />
              </div>
            </Link>
            <Link
              href='https://twitter.com/lastic_xyz'
              target='_blank'
              rel='noreferrer'
              legacyBehavior>
              <div className='rounded-full border border-gray-9 shadow-gray-900 p-4 cursor-pointer hover:scale-110 ease-in duration-300'>
                <FaTwitter />
              </div>
            </Link>
            <Link
              href='https://medium.com/lastic-marketplace'
              target='_blank'
              rel='noreferrer'
              legacyBehavior>
              <div className='rounded-full border border-gray-9 shadow-gray-900 p-4 cursor-pointer hover:scale-110 ease-in duration-300 '>
                <FaMedium />
              </div>
            </Link>
            <Link
              href='https://t.me/+khw2i6GGYFw3NDNi'
              target='_blank'
              rel='noreferrer'
              legacyBehavior>
              <div className='rounded-full border border-gray-9 shadow-gray-900 p-4 cursor-pointer hover:scale-110 ease-in duration-300 '>
                <FaTelegram />
              </div>
            </Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative h-full w-full items-center py-10 justify-center mx-auto z-10">
          <Image
            src='/assets/Images/hero-page.png'
            alt='hero'
            width={602}
            height={692}
            quality={100}
            layout='responsive'
            className='justify-center mx-auto py-2 lg:py-20 2xl:pr-40'
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;

