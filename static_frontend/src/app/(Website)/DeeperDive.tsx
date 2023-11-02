// Dependencies
import PrimaryButton from '@/components/button/PrimaryButton';
import Image from 'next/image';
import React from 'react';

const DeeperDive: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center border-b border-gray-9 py-20 bg-white bg-opacity-70 p-12">
            
            <div className='py-5'>
                {/* Title */}
                <h1 className="text-3xl font-syncopate font-bold text-center mb-4">Why on polkadot?</h1>

                {/* Subtitle */}
                <h2 className="text-xl font-syncopate text-center mb-10">A deeper dive</h2>

            </div>
            
            {/* Image and Info Container */}
            <div className='flex flex-row gap-4'>
                
                {/* Image */}
                <Image 
                    src="/assets/Images/coretime-vis.png"
                    alt="Deeper Dive Image"
                    width={500}
                    height={500}
                    className="rounded-2xl border border-gray-9"
                />
                
                {/* Info */}
                <div className=' max-w-xl p-10'>
                    <div className="text-lg text-left space-y-4 py-5">
                    <p><span className="font-bold">Innovation at the Heart of Blockspace Transactions. </span>
                    Blockspace is more than just storage; it's an essential resource. Other so-called blockspace marketplaces only allow for the re-ordering of transactions or speculation of staking yields. Lastic can do much, much, more.</p>
                    </div>

                    {/* List */}
                    <ul className="list-disc p-10  text-left">
                        <li><span className='font-bold'>Do what you want with your blockspace: </span> Go beyond parachains and utilize your blockspace however you want.</li>
                        <li><span className='font-bold'>Tradable blockspace: </span> With coretime on Polkadot, access to blockspace is represented as NFTs, making it easy to trade.</li>
                        <li><span className='font-bold'>No more auctions: </span> Coretime sales on Polkadot replace the costly and unpredictable slot auctions</li>
                    </ul>
                        
                    {/* Button */}
                    <div className='px-20 py-5'>
                        <PrimaryButton title="Read the docs" location="https://docs.lastic.xyz/" /> 
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DeeperDive;
