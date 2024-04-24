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
    
    // Perform a SQL query to check if the user exists with the given username and password
    const result = await sql`SELECT * FROM users WHERE username = ${username} AND password = ${password}`;
    const user = result.rows[0];
    
    // If no user found, return an error
    if (!user) throw new Error('User not found');
    
    
    // Respond with the user data
    return response.status(200).json({ user });
  } catch (error) {
    return response.status(500).json({ error });
  }
}
