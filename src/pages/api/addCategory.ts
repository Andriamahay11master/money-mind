import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
 
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    const desc = request.query.description as string;
    if (!desc) throw new Error('Description required');
    await sql`INSERT INTO category (description) VALUES (${desc});`;
  } catch (error) {
    return response.status(500).json({ error });
  }
 
  const categories = await sql`SELECT * FROM category;`;
  return response.status(200).json({ categories });
}