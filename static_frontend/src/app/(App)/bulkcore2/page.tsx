'use client';

import SearchSection from './SearchSection';
import SubTitle from '../samesections/SubTitle';
import AnalyticSection from './AnalyticSection';
import SecondaryBulkGraphSection from './SecondaryBulkGraphSection';
import MiniGraphSection from './MiniGraphSection';
import CoreOwners from './CoreOwners';

const Pools = () => {
    return (
      <>
        <SubTitle subtitle="Secondary Bulk coretime market" />
        <SearchSection showMiddleButton={false} />
        <AnalyticSection />
        <SecondaryBulkGraphSection />
        <MiniGraphSection />
        <CoreOwners />
      </>
    );
};

export default Pools;