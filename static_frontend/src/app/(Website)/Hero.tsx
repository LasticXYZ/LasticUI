import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { FaGithub, FaTelegram, FaTwitter, FaMedium } from 'react-icons/fa';
import SecondaryButton from '@/components/button/SecondaryButton';
import PrimaryButton from '@/components/button/PrimaryButton';

const Hero = () => {
  return (
    <div id='home' >
    <div className=' w-full md:justify-start m-auto relative flex flex-col md:flex-row items-center justify-center'>
      <div className='max-w-[500px] w-full px-20 text-center md:text-left md:px-0 py-20 h-full mx-auto p-2 relative z-10'>
        <div>
          <h2 className=' pt-20 py-4 text-gray-17  text-4xl font-syncopate font-bold md:px-0'>
            the world&apos;s first  
            <span className='leading-relaxed px-3 text-transparent  bg-clip-text bg-gradient-to-r from-lastic-spectrum-from via-lastic-spectrum-via to-lastic-spectrum-to'>blockspace</span> marketplace.
          </h2>
          <p className='py-4 md:px-0 text-gray-8 text-lg mx-auto'>
          Do anything you want with your blockspace
          </p>
          <div className=' pt-20'>
            <PrimaryButton title='Launch' location='/instacore'/>
            <SecondaryButton title='See Whitepaper' location='/instacore'/>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 relative z-10">
        <Image
          src='/assets/Images/hero-page.png'
          alt='hero'
          width={700}
          height={700}
          quality={100}
        />
      </div>
    </div>
      <div className='flex items-center justify-center md:justify-start max-w-[400px] px-4 py-8 mx-auto'>
        <Link
          href='https://github.com/LasticXYZ/Lastic'
          target='_blank'
          rel='noreferrer'
          legacyBehavior>
          <div className='rounded-full shadow-lg border border-gray-9 shadow-gray-900 p-4 cursor-pointer hover:scale-110 ease-in duration-300 mr-4'>
            <FaGithub />
          </div>
        </Link>
        <Link
          href='https://twitter.com/lastic_xyz'
          target='_blank'
          rel='noreferrer'
          legacyBehavior>
          <div className='rounded-full shadow-lg border border-gray-9 shadow-gray-900 p-4 cursor-pointer hover:scale-110 ease-in duration-300 mr-4'>
            <FaTwitter />
          </div>
        </Link>
        <Link
          href='https://medium.com/lastic-marketplace'
          target='_blank'
          rel='noreferrer'
          legacyBehavior>
          <div className='rounded-full shadow-lg border border-gray-9 shadow-gray-900 p-4 cursor-pointer hover:scale-110 ease-in duration-300 mr-4'>
            <FaMedium />
          </div>
        </Link>
        <Link
          href='https://t.me/+khw2i6GGYFw3NDNi'
          target='_blank'
          rel='noreferrer'
          legacyBehavior>
          <div className='rounded-full shadow-lg border border-gray-9 shadow-gray-900 p-4 cursor-pointer hover:scale-110 ease-in duration-300 mr-4'>
            <FaTelegram />
          </div>
        </Link>
      </div>
  </div>
  );
};

export default Hero;
