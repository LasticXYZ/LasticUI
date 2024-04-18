import AnalyticCard from '@/components/card/AnalyticCard'
import { parseNativeTokenToHuman } from '@/utils/account/token'
import { useBalance, useInkathon, useRelayBalance } from '@poppyseed/lastic-sdk'

const AnalyticSection = () => {
  const { activeAccount, activeChain } = useInkathon()

  const { freeBalance, tokenSymbol, tokenDecimals } = useBalance(activeAccount?.address, true)
  const { freeBalance: freeRelayBalance } = useRelayBalance(activeAccount?.address, true)

  const coreBalance = parseNativeTokenToHuman({
    paid: freeBalance?.toString(),
    decimals: tokenDecimals,
    reduceDecimals: 2,
  })
  const relayBalance = parseNativeTokenToHuman({
    paid: freeRelayBalance?.toString(),
    decimals: tokenDecimals,
    reduceDecimals: 2,
  })

  if (!activeAccount || !activeChain) {
    return (
      <section className="mx-auto max-w-9xl py-7 px-4 sm:px-6 lg:px-8">
        <div className=" grid grid-cols-1 sm:grid-cols-1  md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-7">
          <AnalyticCard title="-" subtitle="XX on coretime chain" change="" className="py-4" />
          <AnalyticCard title="-" subtitle="XX on relay chain" change="" className="py-4" />
        </div>
      </section>
    )
  }

  let analytics = [
    { title: coreBalance, subtitle: `${tokenSymbol} on coretime chain`, change: '' },
    { title: relayBalance, subtitle: `${tokenSymbol} on relay chain`, change: '' },
  ]

  return (
    <section className="mx-auto max-w-9xl py-7 px-4 sm:px-6 lg:px-8">
      <div className=" grid grid-cols-1 sm:grid-cols-1  md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-7">
        {analytics.map((item, key) => (
          <AnalyticCard
            key={key}
            title={item.title}
            subtitle={item.subtitle}
            change={item.change}
            className="py-4"
          />
        ))}
      </div>
    </section>
  )
}

export default AnalyticSection
