const { Client } = require('pg');

const execSQLQuery = (sqlQry, res) => {
    const connection = new Client({
        host: 'localhost',
        port: 5432,
        user: 'teste1',
        password: '456654',
        database: 'chattask',
    });

    connection.connect()

    connection.query(sqlQry, (error, results) =>{
        if(error){
            res.json(error);
        }else{
            res.json(results.rows)
        }
        connection.end();
        console.log('Executou!')
    });
}

export default execSQLQuery;

