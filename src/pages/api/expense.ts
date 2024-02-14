import { query } from "../../lib/db";

interface ExpenseTableType {
    descriptionForm: string,
    valueExpenses: string,
    categoryExpenses: string
}

export default async function handler(req:any, res:any) {
    let message;
    if( req.method === 'GET') {
        const expenses = await query({
            sql: "SELECT idExpenses, descriptionForm, valueExpenses, dateExpenses, categoryExpenses FROM expenses",
            values:[]
        })
        res.status(200).json({ expenses: expenses })
    }


    //give the code for add expenses
    else if (req.method === "POST") {
        try {
          const { descriptionForm, valueExpenses, categoryExpenses } = req.body;
          const addExpenses = await query({
            sql: "INSERT INTO expenses (descriptionForm, valueExpenses, categoryExpenses) VALUES (?, ?, ?)",
            values: [descriptionForm, valueExpenses, categoryExpenses]
          });
          let expense = {} as ExpenseTableType;
          if (addExpenses) {
            message = "success";
          } else {
            message = "error";
          }
          expense = {
            descriptionForm: descriptionForm,
            valueExpenses: valueExpenses,
            categoryExpenses: categoryExpenses,
          } 
          res.status(200).json({ response: message, expenses: expense });
        } catch (error) {
          console.error("Error while processing POST request:", error);
          res.status(500).json({ response: "error", error: "Internal Server Error" });
        }
      }
    }      
  