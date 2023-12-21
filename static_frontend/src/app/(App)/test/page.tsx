'use client';

import SubTitle from '../samesections/SubTitle';
import TimeSection from './TimeSection';
import CoreUtilisation from './CoreUtilisation';
import { Auctions } from '@/components/callSubscan';

const BulkCore = () => {
    return (
      <>
        <SubTitle subtitle="Primary Bulk coretime market" />
        <TimeSection />
        <CoreUtilisation /> 
        <Auctions />
      </>
    );
};

export default BulkCore;