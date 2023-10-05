/* eslint-disable */
const mysql = require('mysql')
require('dotenv').config()

// for local connections
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   database: 'webfleet',
// })

// const connection = mysql.createConnection({
//   host:'Prod-db.c9kx6wffnsyr.eu-west-2.rds.amazonaws.com' ,
//   user: 'admin',
//   database: 'webfleet',
//   password: 'jQaJeR4djbGVBQqLidpa'
// })

const connection = mysql.createConnection({
  host: process.env.HOST ,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
})


connection.connect((err) => {
  if (err) {
    console.error('error connecting to MySQL:', err.stack)
    return
  }
  console.log('connected to MySQL database')
})

module.exports = connection

  