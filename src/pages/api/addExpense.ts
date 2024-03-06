import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
 
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    const desc = request.query.desc as string;
    const value = request.query.value as string;
    const date = request.query.date as string;
    const category = request.query.category as string;
    const accountId = request.query.accountId as string;
    if (!desc) throw new Error('Description required');
    await sql`INSERT INTO expenses (descriptionForm, valueExpenses, dateExpenses, categoryExpenses, idCompte) VALUES (${desc}, ${value}, ${date}, ${category}, ${accountId});`;
  } catch (error) {
    return response.status(500).json({ error });
  }
 
  const comptes = await sql`SELECT * FROM expense;`;
  return response.status(200).json({ comptes });
}