import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Attempt to create the CoreListing table if it does not exist
    const result = await sql`
      CREATE TABLE IF NOT EXISTS listings (
  id SERIAL PRIMARY KEY,
  "begin" VARCHAR(255) NOT NULL,
  "coreNumber" INT NOT NULL,
  mask VARCHAR(255) NOT NULL,
  "end" VARCHAR(255),
  status VARCHAR(50) NOT NULL,
  network VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  cost VARCHAR(255) NOT NULL,
  "sellerAddress" VARCHAR(255) NOT NULL,
  "buyerAddress" VARCHAR(255),
  "lasticAddress" VARCHAR(255),
  height INT,
  "index" INT
);
    `
    return NextResponse.json({ result }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
