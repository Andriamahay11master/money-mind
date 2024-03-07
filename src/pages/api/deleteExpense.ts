import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
 
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    const idexpense = request.query.idexpense ? parseInt(request.query.idexpense.toString()) : 0;
    await sql`DELETE FROM expenses WHERE idexpenses = ${idexpense};`;
  } catch (error) {
    return response.status(500).json({ error });
  }
 
  const expenses = await sql`SELECT * FROM expenses;`;
  return response.status(200).json({ expenses });
}