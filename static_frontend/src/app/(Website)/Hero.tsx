import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { FaGithub, FaTelegram, FaTwitter, FaMedium } from 'react-icons/fa';
import PrimaryButton from '@/components/button/PrimaryButton';

const Hero = () => {
  return (
    <div id='home' className='bg-[#34737B]' >
    <div className=' w-full md:justify-start m-auto relative flex flex-col md:flex-row items-center justify-center'>
      <div className='max-w-[500px] w-full px-20 text-center md:text-left md:px-0 py-20 h-full mx-auto p-2 relative z-10'>
        <div>
          <h2 className='py-4 text-white text-5xl font-syncopate md:px-0 text-gray-800'>
            the world&apos;s first blockspace marketplace.
          </h2>
          <h4 className='py-4 md:px-0 text-teal-1 text-2xl md:text-2xl mx-auto'>
          Do anything you want with your blockspace
          </h4>
          <PrimaryButton title='Launch marketplace' location='/instacore'/>
        </div>
      </div>

      <div className="w-full md:w-1/2 relative z-10">
        <Image
          src='/assets/Images/bubble-gum.png'
          alt='hero'
          width={800}
          height={800}
        />
      </div>
    </div>
      <div className='flex items-center justify-center md:justify-start max-w-[400px] px-4 py-8 mx-auto'>
        <Link
          href='https://github.com/LasticXYZ/Lastic'
          target='_blank'
          rel='noreferrer'
          legacyBehavior>
          <div className='rounded-full shadow-lg bg-[#5FCEBA] shadow-gray-900 p-6 cursor-pointer hover:scale-110 ease-in duration-300 mr-4'>
            <FaGithub />
          </div>
        </Link>
        <Link
          href='https://twitter.com/lastic_xyz'
          target='_blank'
          rel='noreferrer'
          legacyBehavior>
          <div className='rounded-full shadow-lg bg-[#FF977F] shadow-gray-900 p-6 cursor-pointer hover:scale-105 ease-in duration-300 mr-4'>
            <FaTwitter />
          </div>
        </Link>
        <Link
          href='https://medium.com/lastic-marketplace'
          target='_blank'
          rel='noreferrer'
          legacyBehavior>
          <div className='rounded-full shadow-lg bg-[#FFD28A] shadow-gray-900 p-6 cursor-pointer hover:scale-110 ease-in duration-300 mr-4'>
            <FaMedium />
          </div>
        </Link>
        <Link
          href='https://t.me/+khw2i6GGYFw3NDNi'
          target='_blank'
          rel='noreferrer'
          legacyBehavior>
          <div className='rounded-full shadow-lg bg-[#76EDDD] shadow-gray-900 p-6 cursor-pointer hover:scale-110 ease-in duration-300'>
            <FaTelegram />
          </div>
        </Link>
      </div>
  </div>
  );
};

export default Hero;
