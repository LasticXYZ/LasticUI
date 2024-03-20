// app/api/updateDatabase/route.ts
import fs from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

interface Core {
  id: number;
  coreNumber: number;
  size: number;
  cost: number;
  reward: number;
  owner: string;
  currencyCost: string;
  currencyReward: string;
  mask: string;
  begin: string;
  end: string;
}

interface Database {
  listings: Core[];
}

export async function POST(req: NextApiRequest, res: NextApiResponse){
  try {
    const file = path.join(process.cwd(), 'public', 'database.json');
    const data = JSON.parse(await fs.readFile(file, 'utf8')) as Database;

    // Here, ensure the incoming listing matches the Core interface
    const newListing: Core = req.body.listing;

    // Add the new listing to your database structure
    data.listings.push(newListing);

    await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
    res.status(200).json({ message: 'Database updated successfully' });
  } catch (error) {
    console.error('Error updating the database:', error);
    res.status(500).json({ message: 'Error updating the database', error: (error as Error).message });
  }


  // const data  =await req.json()
  // console.log(data)

  // return NextResponse.json(data)
}