import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
 
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    const idcompte = request.query.idcompte ? parseInt(request.query.idcompte.toString()) : 0;
    await sql`DELETE FROM compte WHERE idcompte = ${idcompte};`;
  } catch (error) {
    return response.status(500).json({ error });
  }
 
  const comptes = await sql`SELECT * FROM compte;`;
  return response.status(200).json({ comptes });
}