const cron = require('node-cron')
const connection = require('../database/database')
const axios = require('axios')

//headers for dvla api
const apiKey = 'P7R3sY1OMs1rXyFxVj67EUE0z7jtNYe6DeMrrZOi';
const url = 'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles';

const headers = {
    'x-api-key': apiKey,
    'Content-Type': 'application/json'
  };


const scheduleCronJobs = () => {


const LicenseExpiry = cron.schedule('0 0 */15 * *', () => {
    connection.query(
      `SELECT driver_name AS name, license_expire_date FROM drivers_details WHERE DATEDIFF(license_expire_date, CURDATE()) <= 15`,
      (err, result) => {
        if (!err) {
          result.forEach(row => {
            const driverName = row.name;
            const expirationDate = row.license_expire_date;
            const currentDate = new Date();          
            if (currentDate > expirationDate) {
              const logs = `${driverName} Driving license has expired.`;
              console.log(logs)
              connection.query(`INSERT INTO notifications (message) VALUES ('${logs}')`, (err, result) => {
                // Handle the result of the INSERT query
              });
            } else {
              const logs = `${driverName} Driving license is about to expire soon.`;
              connection.query(`INSERT INTO notifications (message) VALUES ('${logs}')`, (err, result) => {
                // Handle the result of the INSERT query
  
              });
            }
          });
        } else {
          // Handle error
        }
      }
    );
    connection.query(
      `SELECT registrationNumber AS name, motExpiryDate FROM vehicles_details WHERE DATEDIFF(motExpiryDate, CURDATE()) <= 15`,
      (err, result) => {
        if (!err) {
          result.forEach(row => {
            const VehicleName = row.name;
            const expirationDate = row.motExpiryDate;
            const currentDate = new Date();          
            if (currentDate > expirationDate) {
              const logs = `${VehicleName} Vehicle MOT has expired.`;
              connection.query(`INSERT INTO notifications (message) VALUES ('${logs}')`, (err, result) => {
                // Handle the result of the INSERT query
              });
            } else {
              const logs = `${VehicleName} Vehicle MOT is about to expire soon.`;
              connection.query(`INSERT INTO notifications (message) VALUES ('${logs}')`, (err, result) => {
                // Handle the result of the INSERT query
  
              });
            }
          });
        } else {
          // Handle error
        }
      }
    );
    connection.query(
      `SELECT registrationNumber AS name, taxDueDate FROM vehicles_details WHERE DATEDIFF(taxDueDate, CURDATE()) <= 15`,
      (err, result) => {
        if (!err) {
          result.forEach(row => {
            const VehicleName = row.name;
            const expirationDate = new Date(row.taxDueDate);
     
            const currentDate = new Date();          
        
            if (currentDate > expirationDate) {
              const logs = `${VehicleName} Vehicle Tax is due now.`;
              connection.query(`INSERT INTO notifications (message) VALUES ('${logs}')`, (err, result) => {
                // Handle the result of the INSERT query
              });
            } else {
              const logs = `${VehicleName} Vehicle Tax is about to due soon.`;
              connection.query(`INSERT INTO notifications (message) VALUES ('${logs}')`, (err, result) => {
                // Handle the result of the INSERT query
  
              });
            }
          });
        } else {
          // Handle error
        }
      }
    );
  }, {
    scheduled: true,
    timezone: 'Asia/Kolkata',
  });
  LicenseExpiry.start();


  const DvlaDataUpdate = cron.schedule('0 0 */30 * *',()=>{
  
        connection.query('SELECT registrationNumber as number FROM vehicles_details',(err,result)=>{
            if(!err){
                result.forEach(row => {
                    const vehicleNumber = row.number
                    const data = {
                        registrationNumber: vehicleNumber
                      };
                      axios.post(url, data, { headers: headers })
                      .then((res)=>{
                        // console.log(res.data,"dvla data")
                        if(res.status === 200){
                            connection.query('UPDATE vehicles_details SET ? WHERE registrationNumber = ?',[res.data,vehicleNumber],(err,result)=>{
                                if(!err){
                                    console.log("updated")
                                }
                                else{
                                    console.log(err,"err")
                                }
                            })
                            
                        }
                        else if(res.status === 404){

                        }

                      })
                      .catch(err=>{
                        console.log(err,"bad req")
                      })
                    
                })

            }
            else{

            }
        })
  })
  DvlaDataUpdate.start()


  

};



  module.exports = {
    scheduleCronJobs,
  };