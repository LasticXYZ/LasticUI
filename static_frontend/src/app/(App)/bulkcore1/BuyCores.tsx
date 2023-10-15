import Border from '@/components/border/Border';
import { ConnectButton } from '@/components/web3/ConnectButton';
import React from 'react';

const BuyCores: React.FC = () => {
    return (
        <Border className="h-full flex justify-center items-center">
            <div className="flex justify-center items-center p-20">
                <div className="flex flex-col items-center justify-center p-8 ">
                    <div className="relative w-24 h-24 rounded-full flex items-center justify-center">
                        <div className="absolute z-20 w-16 h-16 bg-teal-4 blur-md backdrop-filter-blur bg-opacity-80 rounded-full flex items-center justify-center">
                        </div>
                        <div className="absolute z-30 w-16 h-16 border border-gray-9 bg-teal-4 backdrop-filter-blur bg-opacity-80 rounded-full flex items-center justify-center">
                            <span className=" my-auto mx-auto text-4xl">👀</span>
                        </div>
                    </div>
                    <p className="mb-6 text-gray-12">Connect wallet in order to be able to renew.</p>
                    <ConnectButton />
                </div>
            </div>
        </Border>
    );
}

export default BuyCores;
