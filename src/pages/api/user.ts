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
          error: "Invalid user value provided",
        });
        return;
      }

      const userUnique = await pool.query({
        text: "SELECT iduser, username, nom, prenom, mail, password FROM user WHERE username ILIKE $1 and password ILIKE $2 ORDER BY iduser",
        values: [`%${valDesc}%`],
      });
      res.status(200).json({ users: userUnique.rows });
    } else {
      const users = await pool.query({
        text: "SELECT iduser, username, nom, prenom, mail FROM user ORDER BY iduser",
      });
      res.status(200).json({ users: users.rows });
    }
  }
}
