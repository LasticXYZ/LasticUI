// app/api/updateDatabase/route.ts
import { CoreListing } from '@/hooks/useListings'
import fs from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

interface Database {
  listings: CoreListing[]
}

/** Adds a new listing to the database */
export async function POST(req: NextRequest) {
  const data: CoreListing = await req.json()
  console.log(data)

  // path to the JSON database
  const filePath = path.join(process.cwd(), 'public', 'database.json') // Only works server-side!

  // Read the existing database
  const fileContents = await fs.readFile(filePath, 'utf8')
  const database: Database = JSON.parse(fileContents)

  // Add the new listing
  database.listings.push(data)

  // Write the updated database back to the file
  await fs.writeFile(filePath, JSON.stringify(database, null, 2), 'utf8')

  return NextResponse.json(data)
}

/** Retrieves the listings. Accepts id as url param filter */
export async function GET(req: NextRequest) {
  // path to the JSON database
  const filePath = path.join(process.cwd(), 'public', 'database.json') // Only works server-side!

  const searchParams = req.nextUrl.searchParams
  const id = searchParams.get('id')

  // Read the existing database
  const fileContents = await fs.readFile(filePath, 'utf8')
  const database: Database = JSON.parse(fileContents)

  // Filter the listings by id
  if (id) {
    const listing = database.listings.find((listing) => listing.id.toString() === id)
    return NextResponse.json(listing)
  }

  return NextResponse.json(database)
}

/** Updates an existing listing. For example, used to update buyerAddress, status, or timepoint. */
export async function PATCH(req: NextRequest) {
  const data: CoreListing = await req.json()
  console.log(data)

  // path to the JSON database
  const filePath = path.join(process.cwd(), 'public', 'database.json') // Only works server-side!

  // Read the existing database
  const fileContents = await fs.readFile(filePath, 'utf8')
  const database: Database = JSON.parse(fileContents)

  // Update the listing
  const index = database.listings.findIndex((listing) => listing.id === data.id)
  database.listings[index] = data

  // Write the updated database back to the file
  await fs.writeFile(filePath, JSON.stringify(database, null, 2), 'utf8')

  return NextResponse.json(data)
}

/** Deletes an existing listing */
export async function DELETE(req: NextRequest) {
  const data: CoreListing = await req.json()
  console.log(data)

  // path to the JSON database
  const filePath = path.join(process.cwd(), 'public', 'database.json') // Only works server-side!

  // Read the existing database
  const fileContents = await fs.readFile(filePath, 'utf8')
  const database: Database = JSON.parse(fileContents)

  // Delete the listing
  database.listings = database.listings.filter((listing) => listing.id !== data.id)

  // Write the updated database back to the file
  await fs.writeFile(filePath, JSON.stringify(database, null, 2), 'utf8')

  return NextResponse.json(data)
}
