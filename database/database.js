/* eslint-disable */
const mysql = require('mysql')
require('dotenv').config()
// for local connections
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   database: 'webfleet',
// })

const connection = mysql.createConnection({
  host: process.env.Host,
  user: process.env.user,
  database: process.env.Database,
  password: process.env.Password
})


connection.connect((err) => {
  if (err) {
    console.error('error connecting to MySQL:', err.stack)
    return
  }
  console.log('connected to MySQL database')
})

module.exports = connection

  