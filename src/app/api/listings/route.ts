// app/api/updateDatabase/route.ts
import { CoreListing } from '@/hooks/useListings'
import { sql } from '@vercel/postgres'
import { NextRequest, NextResponse } from 'next/server'

interface Database {
  listings: CoreListing[]
}

/** Adds a new listing to the database */
export async function POST(req: NextRequest) {
  // Checks TODO: listing already exists? Sender owns core? etc.

  const data: CoreListing = await req.json()

  try {
    const result = await sql`
  INSERT INTO listings (
    begin, "coreNumber", mask, "end", status, network, cost, "sellerAddress", "buyerAddress", "lasticAddress", height, "index"
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

  try {
    if (id) {
      // Query to get a specific listing by id
      const result = await sql`
        SELECT * FROM listings WHERE id = ${id};
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
        SELECT * FROM listings;
      `
      // Return all rows
      return new NextResponse(JSON.stringify(result.rows), { status: 200 })
    }
  } catch (error) {
    console.error('Error during database operation:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}

/** Updates an existing listing. For example, used to update buyerAddress, status, or timepoint. */
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    const data: CoreListing = await req.json()

    if (!data.id) {
      return new NextResponse(JSON.stringify({ message: 'Parameters required' }), { status: 400 })
    }

    const result = await sql`
      UPDATE listings
      SET "buyerAddress" = ${data.buyerAddress}, status = ${data.status}, "lasticAddress" = ${data.lasticAddress}
      WHERE id = ${data.id}
      RETURNING *;
    `

    console.log(result)

    if (result.rowCount > 0) {
      return new NextResponse(JSON.stringify({ result: result.rows[0] }), { status: 200 })
    } else {
      return new NextResponse(JSON.stringify({ message: 'Listing not found or no changes made' }), {
        status: 404,
      })
    }
  } catch (error) {
    console.error('PATCH Error:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
