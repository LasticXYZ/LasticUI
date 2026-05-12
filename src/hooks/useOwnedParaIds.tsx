import { network_list } from '@/config/network'
import { getChainFromPath } from '@/utils/common/chainPath'
import { parseFormattedNumber } from '@/utils/helperFunc'
import { encodeAddress } from '@polkadot/util-crypto'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export type OwnedParaId = {
  paraId: number
  manager: string
  hasCode: boolean
  lifecycle: string | null
  name?: string
}

type OptionalChainValue = {
  isSome?: boolean
  unwrap?: () => { toString: () => string }
}

const getAddressVariants = (address: string, ss58Prefix: number) => {
  const addresses = new Set([address])
  try {
    addresses.add(encodeAddress(address, ss58Prefix))
  } catch {
    return addresses
  }
  return addresses
}

export const useOwnedParaIds = () => {
  const { activeAccount, activeChain, activeRelayChain, relayApi } = useInkathon()
  const pathname = usePathname()
  const network = getChainFromPath(pathname)
  const [ownedParaIds, setOwnedParaIds] = useState<OwnedParaId[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true

    const fetchOwnedParaIds = async () => {
      if (!relayApi?.query?.registrar?.paras || !activeAccount) {
        setOwnedParaIds([])
        return
      }

      setLoading(true)
      try {
        const relaySs58Prefix = activeRelayChain?.ss58Prefix || activeChain?.ss58Prefix || 42
        const activeAddresses = getAddressVariants(activeAccount.address, relaySs58Prefix)
        const entries = await relayApi.query.registrar.paras.entries()

        const owned = entries
          .map(
            ([
              {
                args: [paraId],
              },
              optInfo,
            ]: any) => {
              if (optInfo.isNone) return null
              const paraInfo = optInfo.unwrap()
              const manager = paraInfo.manager.toString()
              const paraIdNumber = parseFormattedNumber(paraId.toString())

              if (!activeAddresses.has(manager)) return null

              return {
                paraId: paraIdNumber,
                manager,
              }
            },
          )
          .filter((entry): entry is { paraId: number; manager: string } => Boolean(entry))

        const ids = owned.map(({ paraId }) => paraId)
        const [codeHashes, lifecycles] = await Promise.all([
          relayApi.query.paras?.currentCodeHash?.multi
            ? relayApi.query.paras.currentCodeHash.multi(ids)
            : Promise.resolve([]),
          relayApi.query.paras?.paraLifecycles?.multi
            ? relayApi.query.paras.paraLifecycles.multi(ids)
            : Promise.resolve([]),
        ])

        const withChainInfo = owned.map(({ paraId, manager }, index) => {
          const codeHash = codeHashes[index] as OptionalChainValue | undefined
          const lifecycle = lifecycles[index] as OptionalChainValue | undefined

          return {
            paraId,
            manager,
            hasCode: Boolean(codeHash?.isSome),
            lifecycle: lifecycle?.isSome ? lifecycle.unwrap?.().toString() || null : null,
            name: network_list[network]?.paraId?.[paraId.toString()]?.name,
          }
        })

        if (mounted) setOwnedParaIds(withChainInfo)
      } catch (error) {
        console.error('Failed to fetch owned ParaIds:', error)
        if (mounted) setOwnedParaIds([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchOwnedParaIds()

    return () => {
      mounted = false
    }
  }, [activeAccount, activeChain, activeRelayChain, network, relayApi])

  return { ownedParaIds, loading }
}
