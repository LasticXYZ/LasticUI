import AnalyticCard from '@/components/card/AnalyticCard';
import {
  useBalance,
  useInkathon,
} from '@poppyseed/lastic-sdk';

  

const AnalyticSection = () => {
  const { 
    api,
    relayApi,
    activeAccount
} = useInkathon();

  const { tokenSymbol, balanceFormatted } = useBalance(activeAccount?.address, true)


  let analytics = [
    { title: '0 LST', subtitle: 'Lastic Tokens', change: '' },
    { title: balanceFormatted, subtitle: `${tokenSymbol} on coretime chain`, change: '' },
    { title: '', subtitle: `${tokenSymbol} on relay chain`, change: ''},
  ]


  return (
    <section className="mx-auto max-w-9xl py-7 px-4 sm:px-6 lg:px-8">
        <div className=" grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-7">
          {analytics.map((item, key) => (
              <AnalyticCard key={key} title={item.title} subtitle={item.subtitle} change={item.change} className='py-4' />
          ))}
        </div> 
    </section>
  )
};

export default AnalyticSection;