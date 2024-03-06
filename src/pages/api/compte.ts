import { createPool } from "@vercel/postgres";
import { NextApiResponse, NextApiRequest } from 'next';

const pool = createPool({
  connectionString: process.env.POSTGRES_URL,
});

interface CompteTableType {
  description: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let message;

  if (req.method === "GET") {
    if (req.query.type === "UNIQUE") {
      const valDesc = req.query.desc;
      if (!valDesc) {
        res.status(400).json({
          response: "error",
          error: "Invalid month value provided",
        });
        return;
      }

      const compteUnique = await pool.query({
        text: "SELECT idcompte, description FROM compte WHERE description ILIKE $1",
        values: [`%${valDesc}%`],
      });
      res.status(200).json({ comptes: compteUnique.rows });
    } else {
      const comptes = await pool.query({
        text: "SELECT idcompte, description FROM compte",
      });
      res.status(200).json({ comptes: comptes.rows });
    }
  }
}
