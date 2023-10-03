import { AnalyticSection, PoolsSection, SearchSection } from '@/sections';
import { GraphSection, MiniGraphSection, Subtitle } from '@/sections';

const Pools = () => {
    return (
      <>
        <SearchSection />
        <AnalyticSection />
        <PoolsSection />
        <SearchSection showMiddleButton={false} />
        <GraphSection />
        <Subtitle subtitle="Info" />
        <AnalyticSection />
        <MiniGraphSection />
        <Subtitle subtitle="Transactions" />
      </>
    );
};

export default Pools;