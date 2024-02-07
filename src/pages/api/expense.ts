import { query } from "../../lib/db";


export default async function handler(req:any, res:any) {
    if( req.method === 'GET') {
        const expenses = await query({
            sql: "SELECT idExpenses, descriptionForm, valueExpenses, dateExpenses, categoryExpenses FROM expenses",
            values:[]
        })
        res.status(200).json({ expenses: expenses })
    }
}