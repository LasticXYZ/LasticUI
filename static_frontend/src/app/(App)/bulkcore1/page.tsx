'use client';

import SubTitle from '../samesections/SubTitle';
import AnalyticSection from './AnalyticSection';
import TimeSection from './TimeSection';
import CoreUtilisation from './CoreUtilisation';

const Pools = () => {
    return (
      <>
        <SubTitle subtitle="Primary Bulk coretime market" />
        <TimeSection />
        <AnalyticSection />
        <CoreUtilisation /> 
      </>
    );
};

export default Pools;