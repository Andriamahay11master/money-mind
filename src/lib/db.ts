import mysql from 'mysql2/promise';

interface QueryProps {
    sql: string;
    values?: any[];
}

export async function query({sql, values} : QueryProps) {
    
    const dbconnection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        port: 3306,
        database: 'moneymind'
    });

    try{
        const [rows] = await dbconnection.execute(sql, values);
        dbconnection.end();
        return rows;
    }
    catch(err:any){
        throw Error(err.message);
        return {err};
    }

}