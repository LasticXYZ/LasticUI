import Border from '@/components/border/Border';
import WalletStatus from '@/components/walletStatus/WalletStatus';
import React from 'react';

const BuyCores: React.FC = () => {
    return (
        <Border className="h-full flex justify-center items-center">
            <WalletStatus />
        </Border>
    );
}

export default BuyCores;
