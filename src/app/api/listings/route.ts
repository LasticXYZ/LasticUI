// app/api/updateDatabase/route.ts
import { CoreListing } from '@/hooks/useListings'
import { sql } from '@vercel/postgres'
import { NextRequest, NextResponse } from 'next/server'

interface Database {
  listings: CoreListing[]
}

/** Adds a new listing to the database */
export async function POST(req: NextRequest) {
  const data: CoreListing = await req.json()

  // TODO: check if seller is logged in and authorized
  // TODO: check if sender owns core

  // check if listing already exists
  const current = await sql`
      SELECT * FROM listings 
      WHERE "coreNumber" = ${data.coreNumber} 
      AND mask = ${data.mask} 
      AND "begin" = ${data.begin} 
      AND network = ${data.network};
    `
  if (current.rowCount > 0) {
    const duplicate = current.rows.some((row) => {
      const listing = row as CoreListing
      return listing.status === 'listed' || listing.status === 'tradeOngoing'
    })

    if (duplicate) {
      return NextResponse.json({ message: 'Listing already exists' }, { status: 400 })
    }
  }

  // insert
  try {
    const result = await sql`
  INSERT INTO listings (
    "begin", "coreNumber", mask, "end", "status", network, cost, "sellerAddress", "buyerAddress", "lasticAddress", height, "index"
  ) VALUES (
    ${data.begin}, ${data.coreNumber}, ${data.mask}, ${data.end}, ${data.status}, ${data.network}, 
    ${data.cost}, ${data.sellerAddress}, ${data.buyerAddress}, ${data.lasticAddress}, ${data.height}, ${data.index}
  ) RETURNING *;
`

    if (result.rowCount > 0) {
      return NextResponse.json({ result: result.rows[0] }, { status: 201 })
    } else {
      return NextResponse.json({ message: 'No data inserted.' }, { status: 400 })
    }
  } catch (error) {
    console.error('Failed to insert listing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/** Retrieves the listings. Accepts id as url param filter */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const id = searchParams.get('id')
  const network = searchParams.get('network')

  if (!network)
    return new NextResponse(JSON.stringify({ message: 'Network parameter required' }), {
      status: 400,
    })

  try {
    if (id) {
      // Query to get a specific listing by id
      const result = await sql`
      SELECT * FROM listings WHERE id = ${id} AND network = ${network};
      `

      console.log(result)
      if (result.rowCount > 0) {
        // Return the first row found
        return new NextResponse(JSON.stringify(result.rows[0]), { status: 200 })
      } else {
        // No listing found with the specified id
        return new NextResponse(JSON.stringify({ message: 'Listing not found' }), { status: 404 })
      }
    } else {
      // Query to get all listings
      const result = await sql`
        SELECT * FROM listings WHERE network = ${network};
      `
      // Return all rows
      return new NextResponse(JSON.stringify(result.rows), { status: 200 })
    }
  } catch (error) {
    console.error('Error during database operation:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    })
  }
}
