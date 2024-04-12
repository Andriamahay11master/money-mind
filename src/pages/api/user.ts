import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
 
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    const username = request.query.username as string;
    if (!username) throw new Error('Username required');
    const password = request.query.password as string;
    if (!password) throw new Error('Password required');
    await sql`SELECT * FROM users 
    WHERE username like ${username}
    AND password like MD5(${password});
    `;
  } catch (error) {
    return response.status(500).json({ error });
  }
 
  const users = await sql`SELECT * FROM users;`;
  return response.status(200).json({ users });
}