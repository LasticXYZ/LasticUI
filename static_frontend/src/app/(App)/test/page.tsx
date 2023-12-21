'use client';

import SubTitle from '../samesections/SubTitle';
import TimeSection from './TimeSection';
import CoreUtilisation from './CoreUtilisation';

const BulkCore = () => {
    return (
      <>
        <SubTitle subtitle="Primary Bulk coretime market" />
        <TimeSection />
        <CoreUtilisation /> 
      </>
    );
};

export default BulkCore;