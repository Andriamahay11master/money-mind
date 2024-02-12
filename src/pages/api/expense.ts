import { query } from "../../lib/db";


export default async function handler(req:any, res:any) {
    let expenses;
    let message;
    if( req.method === 'GET') {
        const expenses = await query({
            sql: "SELECT idExpenses, descriptionForm, valueExpenses, dateExpenses, categoryExpenses FROM expenses",
            values:[]
        })
        res.status(200).json({ expenses: expenses })
    }

    else if(req.method ==="POST"){
        const descriptionFormExpense = req.body.descriptionForm;
        const valueExpenses = req.body.valueExpenses;
        const dateExpenses = req.body.dateExpenses;
        const categoryExpenses = req.body.categoryExpenses;
        const addExpenses = await query({
            sql: "INSERT INTO expenses (descriptionForm, valueExpenses, dateExpenses, categoryExpenses) VALUES (?, ?, ?, ?)",
            values:[descriptionFormExpense, valueExpenses, dateExpenses, categoryExpenses]
        })
        if(addExpenses.insertId){
            message = "sucess"
        }else{
            message = "error"
        }
        let expense = {
            descriptionForm: addExpenses.insertId,
            valueExpenses: valueExpenses,
            dateExpenses: dateExpenses,
            categoryExpenses: categoryExpenses
        }
        res.status(200).json({ message: message, expenses: expenses })
    }
}