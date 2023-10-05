import PrimaryButton from '@/components/button/PrimaryButton';
import AnalyticCard from '@/components/card/AnalyticCard';
import MiningCard from '@/components/card/MiningCard';

const analytics = [
    { title: '20.52 DOT', subtitle: 'Current Price' },
    { title: '20 / 50', subtitle: 'Core sold out of 50 available' },
    { title: 'xx DOT', subtitle: '??' },
]
  

const AnalyticSection = () => (
  <section className="mx-auto max-w-9xl py-10 px-4 sm:px-6 lg:px-8">
      <div className=" grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-7">
        {analytics.map((item, key) => (
            <AnalyticCard key={key} title={item.title} subtitle={item.subtitle} />
        ))}
      </div> 
  </section>
);

export default AnalyticSection;