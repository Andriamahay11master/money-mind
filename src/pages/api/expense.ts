import { query } from "../../lib/db";

interface ExpenseTableType {
    descriptionForm: string,
    valueExpenses: number,
    dateExpenses: Date
    categoryExpenses: string,
    idCompte: number
}

export default async function handler(req:any, res:any) {
    let message;
    if( req.method === 'GET') {
      if(req.query.type === 'LAST_5'){
        const Last5Expenses = await query({
          sql: "SELECT idExpenses, descriptionForm, valueExpenses, dateExpenses, categoryExpenses FROM expenses ORDER BY idExpenses DESC LIMIT 5",
          values:[]
        });
        res.status(200).json({ expenses: Last5Expenses })
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
        
        const expenseMonth = await query({
          sql: "SELECT idExpenses, descriptionForm, valueExpenses, dateExpenses, categoryExpenses FROM expenses WHERE MONTH(dateExpenses) = ?",
          values:[ valMonth ]
        });
        res.status(200).json({ expenses: expenseMonth })
        
      }
      else if(req.query.type === 'CATEGORY'){
        
        const expenseCat = await query({
          sql: "SELECT categoryExpenses, SUM(valueExpenses) AS totalExpenses FROM expenses GROUP BY categoryExpenses ORDER BY totalExpenses DESC LIMIT 5",
        });
        res.status(200).json({ expenses: expenseCat })
        
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
        const expenses = await query({
          sql: "SELECT `idExpenses`, `descriptionForm`, `valueExpenses`, `dateExpenses`, `categoryExpenses`, `idCompte`, `compteDescription` FROM `compteexpense` where `compteDescription` like ?",
          values:[valAccount]
        })
        res.status(200).json({ expenses: expenses })
      }
      else{
        const expenses = await query({
          sql: "SELECT `idExpenses`, `descriptionForm`, `valueExpenses`, `dateExpenses`, `categoryExpenses`, `idCompte`, `compteDescription` FROM `compteexpense`",
          values:[]
        })
        res.status(200).json({ expenses: expenses })
      }
        
    }


    //give the code for add expenses
    else if (req.method === "POST") {
        try {
          const { descriptionForm, valueExpenses, dateExpenses, categoryExpenses, idCompte } = req.body;
          const addExpenses = await query({
            sql: "INSERT INTO expenses (descriptionForm, valueExpenses, dateExpenses, categoryExpenses, idCompte) VALUES (?, ?, ?, ?, ?)",
            values: [descriptionForm, valueExpenses, dateExpenses, categoryExpenses, idCompte]
          });
          let expense = {} as ExpenseTableType;
          if (addExpenses) {
            message = "success";
          } else {
            message = "error";
          }
          expense = {
            descriptionForm: descriptionForm,
            valueExpenses: parseInt(valueExpenses),
            dateExpenses: new Date(),
            categoryExpenses: categoryExpenses,
            idCompte: parseInt(idCompte)
          } 
          res.status(200).json({ response: message, expenses: expense });
        } catch (error) {
          res.status(500).json({ response: "error", error: "Internal Server Error" });
          console.log("Error while processing POST request:", error);
        }
      }
    }      
  