import mysql from 'mysql2/promise';

interface QueryProps {
    sql: string;
    values?: any[];
}

export async function query({sql, values} : QueryProps) {
    
    const dbconnection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
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