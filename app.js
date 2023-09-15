/* eslint-disable */
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const Routes = require('./router/router')
const imageRoutes = require('./controller/controllerUpload')
const { scheduleCronJobs } = require('./controller/cronJobs');


//configuration 
app.use(express.static("./public"))
app.use(bodyParser.json());
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

//for uploading
app.use("/licenseImage",express.static("./public/Driver-img"))

//Router
app.use('/', Routes)
app.use('/', imageRoutes)

// Schedule the license expiry cron job
scheduleCronJobs();

//First Router
app.get("/", (req, res) => {
  res.send('<div style="display: flex; justify-content: center; align-items: center; height: 100vh;"><div style="text-align:center; font-size: 40px; font-weight: 500; font-family: Arial;">Webfleet Backend</div></div>');
});



app.listen(8010, () => {
  console.log('port 8010 Running')
})
