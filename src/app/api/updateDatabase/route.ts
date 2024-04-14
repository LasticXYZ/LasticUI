// app/api/updateDatabase/route.ts
import fs from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

interface Core {
  id: number
  coreNumber: number
  size: number
  cost: number
  reward: number
  owner: string
  currencyCost: string
  currencyReward: string
  mask: string
  begin: string
  end: string
}

interface SentData {
  listing: Core
}

interface Database {
  listings: Core[]
}

export async function POST(req: NextRequest, res: NextResponse) {
  const data: SentData = await req.json()
  console.log(data['listing'])

  // Specify the path to the JSON database
  const filePath = path.join(process.cwd(), 'public', 'database.json') // Only works server-side!

  // Read the existing database
  const fileContents = await fs.readFile(filePath, 'utf8')
  const database: Database = JSON.parse(fileContents)

  // Add the new listing
  database.listings.push(data.listing)

  // Write the updated database back to the file
  await fs.writeFile(filePath, JSON.stringify(database, null, 2), 'utf8')

  return NextResponse.json(data)
}
