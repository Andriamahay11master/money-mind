import { createPool } from "@vercel/postgres";
import { NextApiResponse, NextApiRequest } from 'next';

const pool = createPool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

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
        text: "SELECT idcompte, description FROM compte WHERE description ILIKE $1 ORDER BY idcompte",
        values: [`%${valDesc}%`],
      });
      res.status(200).json({ comptes: compteUnique.rows });
    } else {
      const comptes = await pool.query({
        text: "SELECT idcompte, description FROM compte ORDER BY idcompte",
      });
      res.status(200).json({ comptes: comptes.rows });
    }
  }
}
