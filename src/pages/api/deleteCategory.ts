import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
 
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    const idcategory = request.query.idcategory ? parseInt(request.query.idcategory.toString()) : 0;
    await sql`DELETE FROM category WHERE idcategory = ${idcategory};`;
  } catch (error) {
    return response.status(500).json({ error });
  }
 
  const categories = await sql`SELECT * FROM category;`;
  return response.status(200).json({ categories });
}