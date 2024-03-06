import { createPool } from "@vercel/postgres";
import { NextApiResponse, NextApiRequest } from 'next';

const sql = createPool({
  connectionString: process.env.POSTGRES_URL,
})
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if( req.method === 'GET') {
        const categories = await sql.query({
            text: "SELECT idcategory, description FROM category ORDER BY idcategory ASC ",
        })
        res.status(200).json({ categories: categories.rows })
    }
  }      
  