/* eslint-disable */
"use strict";
const nodemailer = require("nodemailer");
var jwt = require('jsonwebtoken');
const axios = require('axios');
const mysql = require('mysql')
const connection = require('../database/database');


//change this url to original one while deploying site
// const url = 'https://sincprojects.com'
const url = 'http://localhost:3000'

//to fetch report data

exports.reportData = async (req, res) => {
  connection.query('SELECT * FROM vehicles_details', (err, result) => {
    if (!err) {
      res.json(result)
      //   // console.log(result)
    } else {
      res.send(err)
      // // console.log(err)
    }
  })
}

exports.genReports = async (req, res) => {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  // // console.log(startDate);
  // // console.log(endDate);

  connection.query(`SELECT registrationNumber, make, registered_at FROM vehicles_details WHERE group_vehicle = 'grouptext' AND registered_at BETWEEN ? AND ?`, [startDate, endDate], (err, result) => {
    if (!err) {
      if (result.length <= 0) {
        res.status(204).json({ msg: "no data found" })
      } else {
        res.status(200).json(result)
      }
    } else {
      res.status(201).send(err)
    }
  })
}


exports.getNotification = async (req, res) => {
  const id = req.params.id
  const query = `SELECT * from notifications WHERE user_id = 0 ORDER BY id DESC`
  connection.query(query, (err, result) => {
    if (!err) {
      res.status(200).send(result)
      // // console.log(result)
    } else {
      res.status(400).send(err)
      // // console.log(err, 'err')
    }
  })
}


exports.notificationCount = async (req, res) => {
  const id = req.params.id
  // // console.log("called")
  const query = `SELECT * from notifications WHERE user_id = 0 AND status = 0 `
  connection.query(query, (err, result) => {
    if (!err) {
      let lengthData = result.length
      // // console.log(lengthData,"lengthData")
      res.json(lengthData)

    } else {
      res.status(400).send(err)
      // // console.log(err, 'err')
    }
  })
}

exports.ArchiveNotification = async (req, res) => {
  const id = req.params.id
  const query = 'UPDATE notifications SET status = 2 WHERE id = ?'
  connection.query(query, [id], (err, result) => {
    if (!err) {
      res.status(200).send(result)
    } else {
      res.status(400).send(err)
      // // console.log(err, 'err')
    }
  })
}

exports.pushNotification = async (req, res) => {
  const logs = req.params.msg
  // // console.log(logs, 'logs')

  connection.query('SELECT id as users FROM user', (err, results) => {
    if (err) throw err

    // // console.log('Data received from the database:')
    // // console.log('>> results: ', results)
    var string = JSON.stringify(results)
    // // console.log('>> string: ', string)
    var json = JSON.parse(string)
    // // console.log('>> json: ', json)

    let entries = Object.entries(json)
    let UserIds = entries.map(([key, val] = entry) => {
      return val.users
    })
    // // console.log(UserIds)

    UserIds.forEach(function (a, index) {
      const query = `INSERT INTO notifications (message, user_id) VALUES ('${logs}',${a})`
      // // console.log(query)
      connection.query(query, (error, results) => {
        if (error) throw error
        // // console.log(results, 'result')
      })
    })
  })
}

exports.clearAllMsg = async (req, res) => {
  const id = req.params.id
  const query = 'DELETE FROM notifications WHERE user_id = 0 AND status = 1'
  connection.query(query, [id], (err, result) => {
    if (!err) {
      res.status(200).send(result)
    } else {
      res.status(400).send(err)
      // // console.log(err, 'err')
    }
  })
}

exports.MarkAsReadMsg = async (req, res) => {
  const id = req.params.id
  const query = 'UPDATE notifications SET status = 1 WHERE status = 0 AND user_id = 0'
  connection.query(query, [id], (err, result) => {
    if (!err) {
      res.status(200).send(result)
    } else {
      res.status(400).send(err)
      // // console.log(err, 'err')
    }
  })
}

exports.deleteNotificationId = async (req, res) => {
  const id = req.params.id
  const query = 'DELETE FROM notifications WHERE id = ?'
  connection.query(query, [id], (err, result) => {
    if (!err) {
      res.status(200).send(result)
    } else {
      res.status(400).send(err)
      // // console.log(err, 'err')
    }
  })
}

exports.DriverAssignment = async (req, res) => {
  const vehicle_number = req.body.vehicle_number;
  const driver_name = req.body.driver_name;
  // console.log(vehicle_number,driver_name,"data")

  try {
    const updateQuery = 'UPDATE drivers_details SET assigned_vehicle_number = ? WHERE assigned_vehicle_number = ?';
    const selectQuery = 'UPDATE drivers_details SET assigned_vehicle_number = ? WHERE driver_name = ?';

    // Step 1: First, clear the existing assignment of the given vehicle number
    await new Promise((resolve, reject) => {
      connection.query(updateQuery, ['None', vehicle_number], (err, result) => {
        if (err) {

          return reject(err);
        }
        resolve(result);
      });
    });

    // Step 2: Assign the vehicle to the driver
    await new Promise((resolve, reject) => {


      connection.query(selectQuery, [vehicle_number, driver_name], (err, result) => {
        if (err) {
          // console.log(err)

          return reject(err);
        }
        resolve(result);
        // console.log(result)
      });

    });

    // Both updates are successful
    res.status(200).send('Driver assigned successfully.');
  } catch (err) {
    // Handle any errors occurred during the process

    res.status(500).send('Internal Server Error');
  }
};


exports.DriverUnassigned = async (req, res) => {
  const vehicle_number = req.body.vehicle_number
  const driver_name = req.body.driver_name

  const query = `UPDATE drivers_details SET assigned_vehicle_number = 'None' WHERE assigned_vehicle_number = ?`
  connection.query(query, [vehicle_number], (err, result) => {
    if (!err) {
      //  // console.log(result)
      res.status(200).send(result)
    } else {
      //  // console.log(err)
      res.status(400).send(err)
      // // console.log(err, 'err')
    }
  })
}

exports.submitTripRequest = async (req, res) => {
  // // console.log(req.body,"body dtaa")
  const query = `INSERT INTO trip_history SET ?`
  const subQuery = `UPDATE vehicles_details SET status = 'In-Transit' WHERE registrationNumber = ?`
  connection.query(query, [req.body], (err, result) => {
    if (!err) {
      connection.query(subQuery, [req.body.registrationNumber], (err, result) => {
        if (!err) {
          // // console.log("done")
          res.status(200).send(result)
        } else {
          // // console.log(err)
          res.status(400).send(err)
          // // console.log(err, 'err')
        }
      })
    } else {
      //  // console.log(err)
      res.status(400).send(err)
      // // console.log(err, 'err')
    }
  })
}

//  exports.TripHistoryData = async (req, res) => {
//   const query = `SELECT * FROM trip_history`
//   connection.query(query, (err, result) => {
//    if (!err) {

//      res.status(200).send(result)
//    } else {
//      res.status(400).send(err)

//    }
//  })
//  }

exports.TripHistoryData = async (req, res) => {
  const query = `SELECT th.*, v.device_ident, d.phone FROM trip_history AS th INNER JOIN vehicles_details AS v ON th.vehicle_registration_number = v.registrationNumber INNER JOIN drivers_details AS d ON th.operator = d.driver_name WHERE th.Trip_end_status = 0`
  connection.query(query, (err, result) => {
    if (!err) {
      res.status(200).send(result)
    } else {
      res.status(400).send(err)

    }


  })
}

exports.TripHistoryByName = async (req, res) => {
  const driverName = req.params.operator;

  // const query = 'SELECT * FROM trip_history WHERE operator = ?';
  const sql = 'SELECT th.*, vd.make, vd.vin FROM trip_history th JOIN vehicles_details vd ON th.vehicle_registration_number = vd.registrationNumber WHERE th.operator = ? ORDER BY th.timestamp DESC'
  connection.query(sql, [driverName], (err, result) => {
    if (!err) {

      res.status(200).send(result)
    } else {
      res.status(400).send(err)

    }
  })
}

//api for driver assigned vehicle for driver-deshboard
exports.AssignedVehicleDetails = async (req, res) => {
  const operator = req.params.operator;

  const query = 'SELECT * FROM vehicles_details WHERE operator = ?';
  connection.query(query, [operator], (err, result) => {
    if (!err) {
      res.status(200).send(result)
    } else {
      res.status(400).send(err)
    }
  })
}


exports.LoadChartDataApi = async (req, res) => {
  connection.query('SELECT * FROM active_vehicle_history ORDER BY timestamp DESC', (err, result) => {
    if (!err) {
      // // console.log(result)
      res.json(result)
      //   // console.log(result)
    } else {
      res.send(err)
      // // console.log(err)
    }
  })
}

exports.serviceUnassignedDriverApi = async (req, res) => {
  const id = req.params.id
  connection.query(`UPDATE drivers_details SET assigned_vehicle_number = 'None' WHERE assigned_vehicle_number = ?`, [id], (err, result) => {
    if (!err) {
      // // console.log(result)
      // res.json(result)

    } else {
      // res.send(err)
      // // console.log(err)
    }
  })
}

exports.DriverMaintenance = async (req, res) => {
  // const vehicle_number = req.body.vehicle_number
  const driver_name = req.body.driver_name

  const query = `UPDATE drivers_details SET assigned_vehicle_number = 'None', status = 'In maintenance' WHERE driver_name = ?`
  connection.query(query, [driver_name], (err, result) => {
    if (!err) {

      res.status(200).send(result)
    } else {
      //  // console.log(err)
      res.status(400).send(err)
      // // console.log(err, 'err')
    }
  })
}

// SELECT * FROM trip_history WHERE operator = ? ORDER BY Trip_end_status ASC
exports.LoadTripHistoryData = async (req, res) => {
  const id = req.params.name
  const sql = "SELECT th.*, vd.make FROM trip_history th JOIN vehicles_details vd ON th.vehicle_registration_number = vd.registrationNumber WHERE th.operator = ? ORDER BY th.timestamp DESC"
  connection.query(sql, [id], (err, result) => {
    if (!err) {

      res.status(200).json(result)

    } else {
      // res.send(err)

    }
  })
}

exports.EndTripApi = async (req, res) => {
  const { id } = req.body
  const { number } = req.body
  const subQuery = `UPDATE vehicles_details SET status = 'Idle' WHERE registrationNumber = ?`
  connection.query(`UPDATE trip_history SET Trip_end_status = '1' WHERE id = ?`, [id], (err, result) => {
    if (!err) {
      connection.query(subQuery, [number], (err, result) => {
        if (!err) {

          res.status(200).json(result)
        }
        else {
          res.status(404).jason(err)

        }
      })
    }
  })

}

exports.getDriverData = async (req, res) => {
  const id = req.params.id
  connection.query(`SELECT * FROM drivers_details WHERE driver_name = ?`, [id], (err, result) => {
    if (!err) {

      res.status(200).json(result)

    } else {
      // res.send(err)

    }
  })
}

//to get all drivers 
exports.LoadDriverDataApi = async (req, res) => {
  connection.query('SELECT * from drivers_details WHERE role_id = 0', (err, result) => {
    if (!err) {
      res.status(200).json(result)
      // // // console.log(result)
    } else {
      // // // console.log(err)
    }
  })
}

exports.LoadAllVehicle = async (req, res) => {
  connection.query('SELECT vh.*, d.phone FROM vehicles_details AS vh LEFT JOIN drivers_details AS d ON vh.operator = d.driver_name', (err, result) => {
    if (!err) {
      res.status(200).json(result)
      // // console.log(result)
    } else {
      // // console.log(err)
    }
  })
}

exports.DvlaRegisterNumber = async (req, res) => {
  const registrationNumber = req.params.id
  const apiKey = 'P7R3sY1OMs1rXyFxVj67EUE0z7jtNYe6DeMrrZOi';
  const url = 'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles';

  const headers = {
    'x-api-key': apiKey,
    'Content-Type': 'application/json'
  };

  const data = {
    registrationNumber: registrationNumber
  };

  connection.query(`SELECT * FROM vehicles_details WHERE registrationNumber = '${registrationNumber}'`, (err, result) => {
    console.log(result,err,"result")
    if (!err) {
      if(result.length > 0){
        res.status(203).send('registerd')
      }
      else{
        axios.post(url, data, { headers: headers })
      .then(response => {
        if (response.status === 200) {
          res.status(200).send(response.data)
        

        }
        else if( response.status === 404){
          res.status(404).send(response,"not_found")
          console.log("not found")

        }
      
      })
      .catch(error => {
        res.status(400).send("bad_request")
        console.log(error,"error")
      
      });
      }
    } else {
      res.status(400).json(result)
      

    }
  })
  }
