import { CoreListing } from '@/hooks/useListings'
import { sql } from '@vercel/postgres'
import { NextRequest, NextResponse } from 'next/server'

const LASTIC_ADDRESS = process.env.NEXT_PUBLIC_LASTIC_ADDRESS

/** Updates an existing listing by marking it as completed. Updates status. */
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    const data: Pick<CoreListing, 'id' | 'sellerAddress' | 'lasticAddress' | 'network'> =
      await req.json()

    // checks
    if (!data.id || !data.sellerAddress || !data.lasticAddress || !data.network) {
      return new NextResponse(JSON.stringify({ message: 'Parameters required' }), { status: 400 })
    }

    // TODO: verify authorization to finish trade. Either seller or lastic should able to mark as finished.

    // read current listing
    const current = await sql`
    SELECT * FROM listings
    WHERE id = ${data.id} AND network = ${data.network};
    `

    // check listing exists
    if (current.rowCount === 0) {
      return new NextResponse(JSON.stringify({ message: 'Listing not found' }), { status: 404 })
    }
    // check trade is ongoing
    const listing = current.rows[0] as CoreListing
    if (listing.status !== 'tradeOngoing') {
      return new NextResponse(JSON.stringify({ message: 'No Trade in Progress' }), { status: 400 })
    }

    // mutate
    const result = await sql`
    UPDATE listings
    SET status = 'completed'
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
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
