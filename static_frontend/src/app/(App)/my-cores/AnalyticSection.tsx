import AnalyticCard from '@/components/card/AnalyticCard';
import {
  useBalance,
  useInkathon,
} from '@poppyseed/lastic-sdk';

const AnalyticSection = () => {
  const { 
    activeAccount,
    activeChain
} = useInkathon();

  if (!activeAccount || !activeChain) {
    return (
      <section className="mx-auto max-w-9xl py-7 px-4 sm:px-6 lg:px-8">
        <div className=" grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-7">
          <AnalyticCard title='- LST' subtitle='Lastic Tokens' change='' className='py-4' />
          <AnalyticCard title='-' subtitle='XX on coretime chain' change='' className='py-4' />
          <AnalyticCard title='-' subtitle='XX on relay chain' change='' className='py-4' />
        </div> 
      </section>
    )
  }

  let { tokenSymbol, balanceFormatted } = useBalance(activeAccount.address, true)

  if (!balanceFormatted) {
    balanceFormatted = `- ${tokenSymbol}`
  }

  let analytics = [
    { title: '0 LST', subtitle: 'Lastic Tokens', change: '' },
    { title: balanceFormatted, subtitle: `${tokenSymbol} on coretime chain`, change: '' },
    { title: balanceFormatted, subtitle: `${tokenSymbol} on relay chain`, change: ''},
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