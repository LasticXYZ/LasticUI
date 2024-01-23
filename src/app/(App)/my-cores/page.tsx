'use client';

import SubTitle from '../samesections/SubTitle';
import AnalyticSection from './AnalyticSection';
import { useInkathon } from '@poppyseed/lastic-sdk';
import MyCores from './MyCores';
import PastTransactions from './PastTransactions';
import { truncateHash } from '@/utils/truncateHash'
import { encodeAddress } from '@polkadot/util-crypto'


const InstaCore = () => {
    const {
        activeAccount,
        activeChain
    } = useInkathon();

    if (!activeAccount) {
        return (
            <>
                <SubTitle subtitle='Connect your wallet' />
                <AnalyticSection />
                <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 flex flex-col items-stretch">
                    <MyCores />
                </section>
            </>
        );
    }

    return (
      <>
        <SubTitle subtitle={`My wallet: ${truncateHash(encodeAddress(activeAccount.address, activeChain?.ss58Prefix || 42), 8)}`} /> {/* Corrected syntax */}
        <AnalyticSection />
        <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 flex flex-col items-stretch">
            <MyCores />
            <PastTransactions />
        </section>
      </>
    );     
};

export default InstaCore;
