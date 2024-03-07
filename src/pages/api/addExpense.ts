import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
 
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    const desc = request.query.desce as string;
    const value = request.query.valuee !== undefined ? parseInt(request.query.valuee as string) : 1;
    const date = request.query.datee !== undefined ? new Date(request.query.datee as string) : new Date();
    const dateString = date.toISOString();
    const category = request.query.categorye as string;
    const accountId = request.query.accountide !== undefined ? parseInt(request.query.accountide as string) : 1;
    if (!desc) throw new Error('Description required');
    await sql`INSERT INTO expenses (descriptionform, valueexpenses, dateexpenses, categoryexpenses, idcompte) VALUES (${desc}, ${value}, ${dateString}, ${category}, ${accountId});`;
  } catch (error) {
    return response.status(500).json({ error });
  }
 
  const expenses = await sql`SELECT * FROM expenses;`;
  return response.status(200).json({ expenses });
}