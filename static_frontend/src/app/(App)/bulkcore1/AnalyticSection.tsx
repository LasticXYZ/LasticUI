import PrimaryButton from '@/components/button/SecondaryButton';
import AnalyticCard from '@/components/card/AnalyticCard';


const analytics = [
    { title: '20.52 DOT', subtitle: 'Current Price', change: 5},
    { title: '20 / 50', subtitle: 'Core sold out of 50 available', change: -5},
]
  

const AnalyticSection = () => (
    <div className="grid grid-cols-1 items-stretch content-between justify-between w-full flex-grow">
      {analytics.map((item, key) => (
        <div key={key} className='py-4 flex-grow w-full'>
          <AnalyticCard title={item.title} subtitle={item.subtitle} change={item.change} />
        </div>
      ))}
    </div> 
);

export default AnalyticSection;