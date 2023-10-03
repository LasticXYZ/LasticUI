import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { FaGithub, FaTelegram, FaTwitter, FaMedium } from 'react-icons/fa';

const Hero = () => {
  return (
    <div id='home' className='bg-[#34737B] w-full md:justify-start m-auto max-w-[1240px]  relative flex flex-col md:flex-row items-center justify-center'>
      
      <div className='max-w-[500px] w-full px-20 text-center md:text-left md:px-0 py-20 h-full mx-auto p-2 relative z-10'>
        <div>
          <p className='uppercase text-md md:px-0 font-semibold tracking-widest text-[#76EDDD]'>
            POLKADOT&#39;S BLOCKSPACE MARKETPLACE
          </p>
          <h1 className='py-4 md:px-0 text-gray-800'>
             <span className='text-[#FA857A] font-extrabold text-6xl font-syncopate'> LASTIC </span>
          </h1>
          <p className='py-4 md:px-0 text-[#FFD28A] md:text-sm mx-auto'>
          Lastic - the first decentralized coretime market on Polkadot! Lastic transforms blockspace allocation using Polkadot&apos;s coretime model for buying and selling across the ecosystem.
          </p>
          <div className='flex items-center justify-center md:justify-start max-w-[400px] px-4 py-8 mx-auto'>
            <Link
              href='https://github.com/LasticXYZ/Lastic'
              target='_blank'
              rel='noreferrer'
            >
              <div className='rounded-full shadow-lg bg-[#5FCEBA] shadow-gray-900 p-6 cursor-pointer hover:scale-110 ease-in duration-300 mr-4'>
                <FaGithub />
              </div>
            </Link>
            <Link
              href='https://twitter.com/lastic_xyz'
              target='_blank'
              rel='noreferrer'
            >
              <div className='rounded-full shadow-lg bg-[#FF977F] shadow-gray-900 p-6 cursor-pointer hover:scale-105 ease-in duration-300 mr-4'>
                <FaTwitter />
              </div>
            </Link>
            <Link
              href='https://medium.com/lastic-marketplace'
              target='_blank'
              rel='noreferrer'
            >
              <div className='rounded-full shadow-lg bg-[#FFD28A] shadow-gray-900 p-6 cursor-pointer hover:scale-110 ease-in duration-300 mr-4'>
                <FaMedium />
              </div>
            </Link>
            <Link
              href='https://t.me/+khw2i6GGYFw3NDNi'
              target='_blank'
              rel='noreferrer'
            >
              <div className='rounded-full shadow-lg bg-[#76EDDD] shadow-gray-900 p-6 cursor-pointer hover:scale-110 ease-in duration-300'>
                <FaTelegram />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 relative z-10">
        <Image
          src='/assets/Images/bubble-gum.png'
          alt='hero'
          width={800}
          height={800}
          objectFit="cover"
        />
      </div>
    </div>
  );
};

export default Hero;
