const cors = require('cors')
const { Client } = require('pg');
const express = require('express');
const app = express();
const port = 3000;
const postgre = require('pg');
const { chave } = require('./generateKey');
require('dotenv').config();

app.use(express.json());

const db_host = process.env.DB_HOST;
const db_port = process.env.DB_PORT;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_database = process.env.DB_DATABASE;

app.use((req, res, next) => {
    res.header("Acsess-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    app.use(cors());
    next();
})

app.use(cors());

const execSQLQuery = (sqlQry, res) => {
    console.log(chave().length);
    const connection = new Client({
        host: db_host,
        port: db_port,
        user: db_user,
        password: db_password,
        database: db_database,
    });

    connection.connect()

    connection.query(sqlQry, (error, results) => {
        if (error) {
            res.json(error);
        } else {
            res.json(results.rows)
        }
        connection.end();
        console.log('Executou!')
    });
}

const execSQLQueryUser = (sqlQry, res) => {
    console.log(chave().length);
    const connection = new Client({
        host: db_host,
        port: db_port,
        user: db_user,
        password: db_password,
        database: db_database,
    });

    connection.connect()

    connection.query(sqlQry, (error, results) => {
        if (error) {
            res.json(error);
        } else {
            res.json(results.rows[0])
        }
        connection.end();
        console.log('Executou!')
    });
}

// Rota para visualizar todos os usuários
// app.get('/usuarios', (req, res) => {
//     execSQLQuery("SELECT * FROM usuario", res)
// });

//Rota para achar usuário com base no id
// app.get('/usuarios/:id?', (req, res) => {
//     let filter = '';
//     if (req.params.id) filter = ' WHERE id=' + parseInt(req.params.id);
//     execSQLQuery('SELECT * FROM usuario' + filter, res.status("Okay"));
// })

//Excluindo um usuário
app.delete('/usuarios/:id?', (req, res) => {
    execSQLQuery('DELETE FROM usuario WHERE id=' + parseInt(req.params.id), res);
})

//Rota para adicionar um usuário
app.post('/usuarios/sign-up', (req, res) => {
    const id = chave();
    console.log(id)
    const nome = req.body.nome.substring(0, 90);
    const email = req.body.email.substring(0, 90);
    const senha = req.body.senha.substring(0, 30);
    execSQLQuery(`insert into usuario(id, nome, email, senha) 
    values ('${id}','${nome}', '${email}','${senha}')`, res)
})

//Rota para logar usuário
app.post('/usuarios/sign-in', (req, res) => {
    const email = req.body.email.substring(0, 90);
    const senha = req.body.senha.substring(0,30);
    execSQLQueryUser(`SELECT id, nome, email FROM usuario WHERE email='${email}' AND senha='${senha}' `, res);
})

//Atualiza usuário
app.patch('/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const nome = req.body.nome.substring(0, 90);
    const email = req.body.email.substring(0, 90);
    const senha = req.body.senha.substring(0, 30);

    execSQLQuery(`UPDATE usuario SET 
    nome='${nome}', 
    email='${email}', 
    senha='${senha}' WHERE id = ${id}`, res)
})

//Inicia o servidor
app.listen(port);
console.log('Api funcionando')