'use client';

import { AnalyticSection, CoreOwners, GraphSection, MiniGraphSection, Subtitle } from '@/sections';

const Pools = () => {
    return (
      <>
        <Subtitle subtitle="Primary Bulk coretime market" />
        <AnalyticSection />
        <GraphSection />
        <MiniGraphSection />
        <CoreOwners />
        <Subtitle subtitle="Transactions" />
      </>
    );
};

export default Pools;