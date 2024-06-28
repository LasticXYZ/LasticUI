import { CoreListing, networks } from '@/hooks/useListings'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { BN } from '@polkadot/util'
import { sql } from '@vercel/postgres'
import { NextRequest, NextResponse } from 'next/server'
import { calculateMultisigAddress } from '../../../utils/multisigHelper'

const LASTIC_ADDRESS = process.env.NEXT_PUBLIC_LASTIC_ADDRESS

/** Updates an existing listing by marking it as started. Updates buyerAddress, status and lastic address. */
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    const data: Pick<CoreListing, 'id' | 'buyerAddress' | 'network'> = await req.json()

    // checks
    if (!data.id || !data.buyerAddress || !data.network)
      return new NextResponse(JSON.stringify({ message: 'Parameters required' }), { status: 400 })

    // read current listing
    const current = await sql`
    SELECT * FROM listings
    WHERE id = ${data.id} AND network = ${data.network};
    `

    // check listing exists
    if (current.rowCount === 0)
      return new NextResponse(JSON.stringify({ message: 'Listing not found' }), { status: 404 })

    // check listing is tradeable
    const listing = current.rows[0] as CoreListing
    if (listing.status !== 'listed')
      return new NextResponse(JSON.stringify({ message: 'Listing not tradeable' }), { status: 400 })

    // check buyer not set yet
    if (listing.buyerAddress)
      return new NextResponse(JSON.stringify({ message: 'Listing already has a buyer' }), {
        status: 400,
      })

    // check if multisig has funds.
    const hasFunds = hasMultisigFunds(listing, data.buyerAddress, data.network)
    if (!hasFunds)
      return new NextResponse(JSON.stringify({ message: 'Funds not sent to multisig' }), {
        status: 400,
      })
    console.log('multisig has the funds')

    // TODO: authenticate buyer

    // mutate
    const result = await sql`
    UPDATE listings
    SET "buyerAddress" = ${data.buyerAddress}, status = 'tradeOngoing', "lasticAddress" = ${LASTIC_ADDRESS}
    WHERE id = ${data.id} AND network = ${data.network}
    RETURNING *;
    `

    if (result.rowCount > 0)
      return new NextResponse(JSON.stringify({ result: result.rows[0] }), { status: 200 })
    else
      return new NextResponse(JSON.stringify({ message: 'No changes made' }), {
        status: 404,
      })
  } catch (error) {
    console.error('PATCH Error:', error)
    if (error instanceof Error)
      return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 })
    else
      return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}

const hasMultisigFunds = async (listing: CoreListing, buyerAddress: string, network: networks) => {
  const api = await setupApi(network)
  if (!api) throw new Error('API not available')

  // Get ss58Prefix
  const chainProperties = await api.rpc.system.properties()
  const chainPropertiesHuman = chainProperties.toHuman()
  const ss58Prefix = chainPropertiesHuman.ss58Format as number

  const multisigAddress = calculateMultisigAddress(
    2,
    [listing.sellerAddress, buyerAddress, LASTIC_ADDRESS || ''],
    undefined,
    ss58Prefix,
  )

  if (!multisigAddress) throw new Error("Multisig address doesn't exist")

  console.log('Multisig Address:', multisigAddress)

  const res = (await api?.query.system.account(multisigAddress)) as any

  if (!res) return false
  const { data: balance } = res

  const cleanedBalance = balance?.free.toString().replace(/,/g, '')
  const balanceBN = new BN(cleanedBalance)
  console.log('Balance:', balanceBN.toString())

  if (balanceBN?.gte(new BN(listing.cost))) return true
  else return false
}

const setupApi = async (network: networks): Promise<ApiPromise | undefined> => {
  let apiString

  switch (network) {
    case 'Rococo Coretime Testnet':
      apiString = 'wss://rococo-coretime-rpc.polkadot.io'
      break
    case 'Kusama Coretime':
      apiString = 'wss://sys.ibp.network/coretime-kusama'
      break
    case 'Polkadot Coretime':
      apiString = 'wss://polkadot-coretime-rpc.polkadot.io' // TODO update once rolled out
      break
  }

  if (!apiString) return
  const wsProvider = new WsProvider('wss://rococo-coretime-rpc.polkadot.io')
  const api = await ApiPromise.create({ provider: wsProvider })

  return api
}
