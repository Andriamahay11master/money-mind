import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
 
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    const desc = request.query.desc as string;
    if (!desc) throw new Error('Description required');
    await sql`INSERT INTO compte (description) VALUES (${desc});`;
  } catch (error) {
    return response.status(500).json({ error });
  }
 
  const comptes = await sql`SELECT * FROM compte;`;
  return response.status(200).json({ comptes });
}