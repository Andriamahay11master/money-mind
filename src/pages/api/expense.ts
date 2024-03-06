import { createPool } from "@vercel/postgres";
import { NextApiResponse, NextApiRequest } from 'next';

const sql = createPool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if( req.method === 'GET') {
      if(req.query.type === 'LAST_5'){
        const valAccount = req.query.valAccount;
        if (!valAccount) {
          res.status(400).json({
            response: "error",
            error: "Invalid month value provided",
          });
          return;
        }
        const Last5Expenses = await sql.query({
          text: "SELECT idexpenses, descriptionForm, valueexpenses, dateexpenses, categoryexpenses, idcompte, comptedescription FROM compteexpense where comptedescription ILIKE $1 ORDER BY idexpenses DESC LIMIT 5",
          values:[valAccount]
        });
        res.status(200).json({ expenses: Last5Expenses.rows })
      }
      else if(req.query.type === 'LAST_5_ALL'){
        const Last5Expenses = await sql.query({
          text: "SELECT idexpenses, descriptionForm, valueexpenses, dateexpenses, categoryexpenses, idcompte, comptedescription FROM compteexpense ORDER BY idexpenses DESC LIMIT 5;",
        });
        res.status(200).json({ expenses: Last5Expenses.rows })
      }
      else if(req.query.type === 'MONTH'){
        const valMonth = req.query.valMonth;
        if (!valMonth) {
          res.status(400).json({
            response: "error",
            error: "Invalid month value provided",
          });
          return;
        }
        
        const expenseMonth = await sql.query({
          text: "SELECT idexpenses, descriptionform, valueexpenses, dateexpenses, categoryexpenses, idcompte, comptedescription FROM compteexpense where comptedescription ILIKE $1 ",
          values:[ valMonth ]
        });
        res.status(200).json({ expenses: expenseMonth.rows })
        
      }
      else if(req.query.type === 'CATEGORY'){
        
        const expenseCat = await sql.query({
          text: "SELECT categoryexpenses, SUM(valueexpenses) AS totalexpenses FROM expenses GROUP BY categoryexpenses ORDER BY totalexpenses DESC LIMIT 5",
        });
        res.status(200).json({ expenses: expenseCat.rows })
        
      }
      else if(req.query.type === 'CATEGORY_CURRENT'){
        const valAccount = req.query.valAccount;
        if (!valAccount) {
          res.status(400).json({
            response: "error",
            error: "Invalid month value provided",
          });
          return;
        }
        const expenseCat = await sql.query({
          text: "SELECT categoryexpenses, SUM(valueexpenses) AS totalexpenses FROM compteexpense WHERE comptedescription ILIKE $1 GROUP BY categoryexpenses ORDER BY totalexpenses DESC LIMIT 5",
          values:[valAccount]
        });
        res.status(200).json({ expenses: expenseCat.rows })
        
      }
      else if(req.query.type === 'ACCOUNT'){
        const valAccount = req.query.valAccount;
        if (!valAccount) {
          res.status(400).json({
            response: "error",
            error: "Invalid month value provided",
          });
          return;
        }
        const expenses = await sql.query({
          text: "SELECT idexpenses, descriptionform, valueexpenses, dateexpenses, categoryexpenses, idcompte, comptedescription FROM compteexpense where comptedescription like $1 ORDER BY idexpenses ASC",
          values:[valAccount]
        })
        res.status(200).json({ expenses: expenses.rows })
      }
      else{
        const expenses = await sql.query({
          text: "SELECT idexpenses, descriptionform, valueexpenses, dateexpenses, categoryexpenses, idcompte, comptedescription FROM compteexpense ORDER BY idexpenses ASC",
        })
        res.status(200).json({ expenses: expenses.rows })
      }
        
    }
}      
  