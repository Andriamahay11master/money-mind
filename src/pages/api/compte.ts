import { query } from "../../lib/db";

interface CompteTableType {
    description: string,
}

export default async function handler(req:any, res:any) {
    let message;
    if( req.method === 'GET') {
      if(req.query.type === 'UNIQUE'){
        const valDesc = req.query.desc;
        if (!valDesc) {
          res.status(400).json({
            response: "error",
            error: "Invalid month value provided",
          });
          return;
        }
        
        const expenseUnique = await query({
          sql: "SELECT idCompte, description FROM compte WHERE description like ?",
          values:[ valDesc ]
        });
        res.status(200).json({ expenses: expenseUnique })
        
      }
        const comptes = await query({
            sql: "SELECT idCompte, description FROM compte",
            values:[]
        })
        res.status(200).json({ comptes: comptes })
    }


    //give the code for add compte
    else if (req.method === "POST") {
        try {
          const { description } = req.body;
          const addCompte = await query({
            sql: "INSERT INTO compte (description) VALUES (?)",
            values: [description]
          });
          let compte = {} as CompteTableType;
          if (addCompte) {
            message = "success";
          } else {
            message = "error";
          }
          compte = {
            description: description,
          } 
          res.status(200).json({ response: message, comptes: compte });
        } catch (error) {
          res.status(500).json({ response: "error", error: "Internal Server Error" });
          console.error("Error while processing POST request:", error);
        }
      }
    }      
  