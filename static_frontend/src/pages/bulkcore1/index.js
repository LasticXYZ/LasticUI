import { AnalyticSection, PoolsSection, SearchSection } from '@/sections';
import { GraphSection, MiniGraphSection, Subtitle } from '@/sections';

const Pools = () => {
    return (
      <>
        <AnalyticSection />
        <GraphSection />
        <Subtitle subtitle="Info" />
        <AnalyticSection />
        <MiniGraphSection />
        <PoolsSection />

        <Subtitle subtitle="Transactions" />
      </>
    );
};

export default Pools;