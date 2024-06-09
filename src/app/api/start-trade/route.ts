import { CoreListing } from '@/hooks/useListings'
import { sql } from '@vercel/postgres'
import { NextRequest, NextResponse } from 'next/server'

const LASTIC_ADDRESS = process.env.NEXT_PUBLIC_LASTIC_ADDRESS

/** Updates an existing listing by marking it as started. Updates buyerAddress, status and lastic address. */
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    const data: Pick<CoreListing, 'id' | 'buyerAddress' | 'network'> = await req.json()

    // checks
    if (!data.id || !data.buyerAddress || !data.network) {
      return new NextResponse(JSON.stringify({ message: 'Parameters required' }), { status: 400 })
    }

    // read current listing
    const current = await sql`
    SELECT * FROM listings
    WHERE id = ${data.id} AND network = ${data.network};
    `

    // check listing exists
    if (current.rowCount === 0) {
      return new NextResponse(JSON.stringify({ message: 'Listing not found' }), { status: 404 })
    }
    // check listing is tradeable
    const listing = current.rows[0] as CoreListing
    if (listing.status !== 'listed') {
      return new NextResponse(JSON.stringify({ message: 'Listing not tradeable' }), { status: 400 })
    }
    // check buyer not set yet
    if (listing.buyerAddress) {
      return new NextResponse(JSON.stringify({ message: 'Listing already has a buyer' }), {
        status: 400,
      })
    }

    // TODO: check if multisig has funds. Read from chain. Similar to hasMultisigAddressTheCoreFunds inside useListingsTracker.tsx
    const hasFunds = true
    if (!hasFunds) {
      return new NextResponse(JSON.stringify({ message: 'Funds not sent to multisig' }), {
        status: 400,
      })
    }

    // TODO: verify buyer is logged in

    // mutate
    const result = await sql`
    UPDATE listings
    SET "buyerAddress" = ${data.buyerAddress}, status = 'tradeOngoing', "lasticAddress" = ${LASTIC_ADDRESS}
    WHERE id = ${data.id} AND network = ${data.network}
    RETURNING *;
    `

    console.log(result)

    if (result.rowCount > 0)
      return new NextResponse(JSON.stringify({ result: result.rows[0] }), { status: 200 })
    else
      return new NextResponse(JSON.stringify({ message: 'No changes made' }), {
        status: 404,
      })
  } catch (error) {
    console.error('PATCH Error:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
