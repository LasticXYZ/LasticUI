import Border from '@/components/border/Border'
import CoreItemExtensive from '@/components/cores/CoreItemExtensive'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import { useEffect, useState } from 'react'

// Define a type for the queryParams
type QueryParams = (string | number | Record<string, unknown>)[]

type RegionDetailItem = {
  begin: string
  core: string
  mask: string
}

type RegionDetail = RegionDetailItem[]

type RegionOwner = {
  end: string
  owner: string
  paid: string
}

type Region = {
  detail: RegionDetail
  owner: RegionOwner
}

type RegionsType = Region[]

// Custom hook for querying substrate state
function useRegionQuery() {
  const { api } = useInkathon()
  const [data, setData] = useState<RegionsType | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (api?.query?.broker?.regions) {
        try {
          const entries = await api.query.broker.regions.entries()
          const regions: RegionsType = entries.map(([key, value]) => {
            const detail = key.toHuman() as RegionDetail
            const owner = value.toHuman() as RegionOwner
            return { detail, owner }
          })
          setData(regions)
        } catch (error) {
          console.error('Failed to fetch regions:', error)
        }
      }
    }

    fetchData()
    const intervalId = setInterval(fetchData, 5000)

    return () => clearInterval(intervalId)
  }, [api])

  return data
}

function parseAndDividePaid(paid: string): number {
  const numberWithoutCommas = paid.replace(/,/g, '')
  const number = parseInt(numberWithoutCommas, 10)
  return number / 10 ** 12
}

export default function BrokerRegionData() {
  const { activeAccount, activeChain } = useInkathon()
  let { tokenSymbol } = useBalance(activeAccount?.address, true)
  const regionData = useRegionQuery()

  if (!activeAccount || !activeChain) {
    return <WalletStatus />
  }

  // Filter regions where activeAccount's address matches the region owner's address
  const filteredRegionData = regionData?.filter(
    (region) => region.owner.owner === activeAccount.address,
  )

  return filteredRegionData && filteredRegionData.length > 0 ? (
    <Border>
    <div className="h-full w-full flex flex-col justify-left items-left">
      <div>
        {filteredRegionData.map((region, index) => (
          <div key={index} className="">
            <CoreItemExtensive
              timeBought="Jan 2024"
              coreNumber={region.detail[0].core}
              size="1"
              phase="- Period"
              cost={parseAndDividePaid(region.owner.paid)}
              reward="0"
              currencyCost={tokenSymbol}
              currencyReward="LASTIC"
              mask={region.detail[0].mask}
              begin={region.detail[0].begin}
              end={region.owner.end}
            />
          </div>
        ))}
      </div>
    </div>
    </Border>

  ) : (
    <Border>
    <WalletStatus />
    </Border>
  )
}
