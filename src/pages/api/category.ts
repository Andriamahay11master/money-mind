import { query } from "../../lib/db";

interface CategoryTableType {
    description: string,
}

export default async function handler(req:any, res:any) {
    let message;
    if( req.method === 'GET') {
        const categories = await query({
            sql: "SELECT idCategory, description FROM category",
            values:[]
        })
        res.status(200).json({ categories: categories })
    }


    //give the code for add category
    else if (req.method === "POST") {
        try {
          const { description } = req.body;
          const addCategory = await query({
            sql: "INSERT INTO category (description) VALUES (?)",
            values: [description]
          });
          let category = {} as CategoryTableType;
          if (addCategory) {
            message = "success";
          } else {
            message = "error";
          }
          category = {
            description: description,
          } 
          res.status(200).json({ response: message, categories: category });
        } catch (error) {
          res.status(500).json({ response: "error", error: "Internal Server Error" });
          console.error("Error while processing POST request:", error);
        }
      }
    }      
  