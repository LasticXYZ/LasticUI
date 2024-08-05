// useRegionQuery.ts

import { useInkathon } from '@poppyseed/lastic-sdk'
import { useEffect, useState } from 'react'

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

export const useRegionQuery = (updateInterval?: number): RegionsType | null => {
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
    if (updateInterval) {
      const intervalId = setInterval(fetchData, updateInterval) as unknown as number
      return () => clearInterval(intervalId)
    }
  }, [api, updateInterval])

  return data
}
