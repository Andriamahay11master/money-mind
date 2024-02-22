import { query } from "../../lib/db";

interface ExpenseTableType {
    descriptionForm: string,
    valueExpenses: string,
    dateExpenses: Date
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
          const { descriptionForm, valueExpenses, dateExpenses, categoryExpenses } = req.body;
          const addExpenses = await query({
            sql: "INSERT INTO expenses (descriptionForm, valueExpenses, dateExpenses, categoryExpenses) VALUES (?, ?, ?, ?)",
            values: [descriptionForm, valueExpenses, dateExpenses, categoryExpenses]
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
            dateExpenses: new Date(),
            categoryExpenses: categoryExpenses,
          } 
          res.status(200).json({ response: message, expenses: expense });
        } catch (error) {
          res.status(500).json({ response: "error", error: "Internal Server Error" });
          console.error("Error while processing POST request:", error);
        }
      }
    }      
  