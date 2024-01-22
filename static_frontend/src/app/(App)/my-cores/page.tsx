'use client';

import SubTitle from '../samesections/SubTitle';
import AnalyticSection from './AnalyticSection';
import { useInkathon } from '@poppyseed/lastic-sdk';
import BuyCores from './BuyCores';
import PastTransactions from './PastTransactions';

const InstaCore = () => {
    const { activeAccount } = useInkathon();
    const coretimeAddress = activeAccount?.address;

    return (
      <>
        <SubTitle subtitle={`My wallet: ${coretimeAddress}`} /> {/* Corrected syntax */}
        <AnalyticSection />
        <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 flex flex-col items-stretch">
            <BuyCores />
            <PastTransactions />
        </section>
      </>
    );
};

export default InstaCore;
