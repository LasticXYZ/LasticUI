import Border from '@/components/border/Border';
import CuteInfo from '@/components/info/CuteInfo';
import { ConnectButton } from '@/components/web3/ConnectButton';
import React from 'react';

const BuyCores: React.FC = () => {
    return (
        <Border className="h-full flex justify-center items-center">
            <div className="flex justify-center items-center py-20 px-4">
                <div className="flex flex-col items-center justify-center px-2 py-8 ">
                    <CuteInfo emoji="👀" message="Connect wallet in order to buy instantaneous coretime." color="bg-teal-4"/>
                    <ConnectButton />
                </div>
            </div>
        </Border>
    );
}

export default BuyCores;
