import {
  AllowedRenewalAssignmentInfo,
  AllowedRenewalCoreInfoUnf,
  AllowedRenewalsType,
} from '@/types'
import { ApiPromise } from '@polkadot/api'
import { useEffect, useState } from 'react'

// Custom hook for querying and transforming workplan data
export const useAllowedRenewalsQuery = (api: ApiPromise | undefined) => {
  const [data, setData] = useState<AllowedRenewalsType | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!api?.query?.broker?.workplan) return
      try {
        const entries = await api.query.broker.allowedRenewals.entries()
        const allowedRenewals: AllowedRenewalsType = entries.map(([key, value]) => {
          const coreInfo: AllowedRenewalCoreInfoUnf[] = key.toHuman() as AllowedRenewalCoreInfoUnf[]
          const assignmentInfo: AllowedRenewalAssignmentInfo =
            value.toHuman() as AllowedRenewalAssignmentInfo
          return { coreInfo, assignmentInfo }
        })
        setData(allowedRenewals)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchData()
    const intervalId = setInterval(fetchData, 5000) as unknown as number
    return () => clearInterval(intervalId)
  }, [api])

  return data
}

// Custom hook for querying and transforming workplan data
export const usePotentialRenewalsQuery = (api: ApiPromise | undefined) => {
  const [data, setData] = useState<AllowedRenewalsType | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!api?.query?.broker?.workplan) return
      try {
        const entries = await api.query.broker.potentialRenewals.entries()
        const potentialRenewals: AllowedRenewalsType = entries.map(([key, value]) => {
          const coreInfo: AllowedRenewalCoreInfoUnf[] = key.toHuman() as AllowedRenewalCoreInfoUnf[]
          const assignmentInfo: AllowedRenewalAssignmentInfo =
            value.toHuman() as AllowedRenewalAssignmentInfo
          return { coreInfo, assignmentInfo }
        })
        setData(potentialRenewals)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchData()
    const intervalId = setInterval(fetchData, 5000) as unknown as number
    return () => clearInterval(intervalId)
  }, [api])

  return data
}
