'use client';

import SubTitle from '../samesections/SubTitle';
import AnalyticSection from './AnalyticSection';
import CoreOwners from './CoreOwners';
import PrimaryBulkGraphSection from './PrimaryBulkGraphSection';
import MiniGraphSection from './MiniGraphSection';
import CoreUtilisation from './CoreUtilisation';

const Pools = () => {
    return (
      <>
        <SubTitle subtitle="Primary Bulk coretime market" />
        <AnalyticSection />
        <PrimaryBulkGraphSection />
        <MiniGraphSection />
        <CoreUtilisation /> 
      </>
    );
};

export default Pools;