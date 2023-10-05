'use client';

import SubTitle from './SubTitle';
import AnalyticSection from './AnalyticSection';
import CoreOwners from './CoreOwners';
import PrimaryBulkGraphSection from './PrimaryBulkGraphSection';
import MiniGraphSection from './MiniGraphSection';

const Pools = () => {
    return (
      <>
        <SubTitle subtitle="Primary Bulk coretime market" />
        <AnalyticSection />
        <PrimaryBulkGraphSection />
        <MiniGraphSection />
        <CoreOwners />
      </>
    );
};

export default Pools;