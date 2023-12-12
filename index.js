const cors = require('cors')
const { Client } = require('pg');
const express = require('express');
const app = express();
const port = 3001;
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


app.post('/users/sign-up', (req, res) => {
    const id = chave();
    console.log(id)
    const name = req.body.name.substring(0, 100);
    const last_name = req.body.last_name.substring(0, 100);
    const username = req.body.username.substring(0, 100);
    const email = req.body.email.substring(0, 100);
    const registration_number = req.body.registration_number.substring(0, 100);
    const undergraduate_degree = req.body.undergraduate_degree.substring(0, 100);
    const initial_semester = req.body.initial_semester.substring(0, 100);
    const level = req.body.level.substring(0, 100);
    const password = req.body.password.substring(0, 100);
    const cpf = req.body.cpf.substring(0, 100);
    const rg = req.body.rg.substring(0, 30);
    const date_of_birth = req.body.date_of_birth.substring(0, 100);

    execSQLQuery(`insert into student(name,
                                      last_name, 
                                      email,
                                      username,
                                      registration_number,
                                      cpf,
                                      rg,
                                      date_of_birth,
                                      undergraduate_degree,
                                      initial_semester,
                                      level,
                                      password
                                      ) 
    values ('${name}',
            '${last_name}',
            '${email}',
            '${username}',
            '${registration_number}',
            '${cpf}',
            '${rg}',
            '${date_of_birth}',
            '${undergraduate_degree}',
            '${initial_semester}',
            '${level}',
            '${password}')`, res)
})


app.post('/users/sign-in', (req, res) => {
    const username = req.body.username.substring(0, 90);
    const password = req.body.password.substring(0, 30);
    execSQLQueryUser(`SELECT id, 
                      name,
                      last_name,
                      email,
                      registration_number,
                      undergraduate_degree,
                      initial_semester,
                      level FROM student WHERE username='${username}' AND password='${password}' `, res);
})

app.post('/users/get-data-user', (req, res) => {
    const id = req.body.id.substring(0,90);
   


    execSQLQueryUser(`SELECT
        name,
        last_name,
        email,
        registration_number,
        undergraduate_degree,
        initial_semester,
        level
        FROM
        student
    WHERE
        id = ${id}`, res);
})


app.listen(port);
console.log('Api funcionando')