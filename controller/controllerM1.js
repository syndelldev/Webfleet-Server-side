/* eslint-disable */
const nodemailer = require("nodemailer");
var jwt = require('jsonwebtoken');
const connection = require('../database/database')
const axios = require('axios')
require('dotenv').config()


//login auth new by sarans
exports.loginAuth = async (req, res) => {
  const username = req.body.email
  const password = req.body.user_password

  connection.query(
    'SELECT * FROM user WHERE user_email = ?',
    [username],
    (err, result) => {
      console.log(err,result,"result")
      if (result.length > 0) {
        if (err) {
          // // console.error(err);
          res.status(500).json('An error occurred while attempting to log in.');
          return;
        }

        if (result.length === 0) {
          res.status(210).json('notUser');
          console.log(result,"result")
          return;
        }
        const user = result[0];
        const secretKey = process.env.JWT_SECRET;
        // Generate a JWT token
        const Token = jwt.sign({ userEmail: user.user_email }, secretKey, { expiresIn: '1h' });
        console.log(Token,"jwt")

        if (user.user_password !== password) {
          res.status(211).json('Invalid');
          return;
        }
        if (user.role_id === 1) {
          res.status(203).json(Token);  
          console.log(user.role_id,"roll")
        }
        else if (user.role_id === 2) {
          res.status(204).json(Token);
        } 
        else {
          res.status(205).json(Token);
        }
      }
      else {
        res.status(210).json('notUser')
        // // // console.log('user not found')
      }


    })
}




//register user
exports.registerUser = async (req, res) => {
  // // // console.log(req.body)

  connection.query('INSERT INTO user SET ?', [req.body], (err, result) => {
    if (!err) {
      res.status(202).json('registered')
      // // // console.log('The data from users table are: \n', result)
    } else {
      // // // console.log(err)
      res.status(400).json(err.sqlMessage)
    }
  })
}
//  ----------------------------------------user api ---------------------------------------------------------

//get user details
exports.allUser = async (req, res) => {
  connection.query('SELECT * FROM user', (err, result) => {
    if (!err) {
      res.status(200).json(result)
      // // // console.log('The data from users table are: \n', result)
    } else {
      // // // console.log(err)
      res.status(400).json(err.sqlMessage)
    }
  })
}

//get single user from id
exports.userUpdateId = async (req, res) => {
  const id = req.params.id
  // // // console.log(id, 'id no')
  connection.query('SELECT * from user WHERE id = ?', [req.params.id], (err, result) => {
    if (!err) {
      res.status(200).send(result)
      // // // console.log('The data from users table are: \n', result)
    } else {
      // // // console.log(err)
      res.status(400).send(err)
    }
  })
}

//get single username
exports.UsernameDropDownN = async (req, res) => {
  const obj = req.body
  const email = Object.keys(obj)[0]

  connection.query('SELECT * from user WHERE user_email = ?', [email], (err, result) => {
    if (!err) {
      res.json(result.data)
    } else {
      // // // console.log(err)
      res.status(400).send(err)
    }
  })
}

//get single username
exports.GetUserName = async (req, res) => {
  const email = req.params.email
  // console.log(email,"email");
  connection.query('SELECT * from user WHERE user_email = ?', [email], (err, result) => {
    if (!err) {
      res.status(200).json(result)
      // console.log(result)

    } else {
      // console.log(err)
      res.status(400).send(err)
    }
  })
}

exports.userProfileId = async (req, res) => {
  const id = req.params.id
  // // // console.log(id, 'id no')
  connection.query('SELECT * from user WHERE id = ?', [req.params.id], (err, result) => {
    if (!err) {
      res.status(200).send(result)
      // // // console.log('The data from users table are: \n', result)
    } else {
      // // // console.log(err)
      res.status(400).send(err)
    }
  })
}
// //profileupdateid

exports.userProfileId = async (req, res) => {
  const id = req.params.id
  // // // console.log(id, 'id no')

  connection.query('SELECT * from user WHERE id = ?', [req.params.id], (err, result) => {
    if (!err) {
      res.status(200).send(result)
      // // // console.log('The data from users table are: \n', result)
    } else {
      // // // console.log(err)
      res.status(400).send(err)
    }
  })
}

//to updtae single user
exports.userUpdate = async (req, res) => {
  const id = req.body.id
      // console.log(id,req.body,"dataa")


  connection.query('UPDATE user SET ? WHERE id = ?', [req.body, id], (err, result) => {
    if (!err) {
      res.json('updated')
      // console.log(result,"err")

    } else {
      res.status(400).send(err)
      // console.log(err,"err")
    }
  })
}

//to delete user by id
exports.userDelete = async (req, res) => {
  const id = req.params.id
  // // // console.log(id)
  connection.query('DELETE from user WHERE id = ?', [req.params.id], (err, result) => {
    if (!err) {
      res.json('deleted')
      // // // console.log('The data from users table are: \n', result)
    } else {
      // // // console.log(err)
      res.status(400).send(err)
    }
  })
}
//Add new Driver api ________________________________________________________________________________________
exports.adddriver = async (req, res) => {

  connection.query('INSERT INTO drivers_details SET ?', [req.body], (err, result) => {
    if (!err) {

      res.status(200).json('add Vehicle')
      console.log('The data from vehicles details table are: \n', result)
    }
    else if (err.code === 'ER_DUP_ENTRY') {


      res.status(203).json("unique")
    } else {
      console.log(err,"err")
      res.status(210).json(err.sqlMessage)
    }
  })
}

//to get all drivers 
// 'SELECT * from drivers_details WHERE role_id = 0'
exports.driverList = async (req, res) => {
  connection.query('SELECT * from drivers_details ', (err, result) => {
    if (!err) {
      res.json(result)
      // // // console.log(result)
    } else {
      // // // console.log(err)
    }
  })
}

//to get active drivers
exports.allDrivers = async (req, res) => {
  connection.query('SELECT COUNT(ALL Operator) from drivers_details', (err, result) => {
    if (!err) {
      res.send(result)
    } else {
      // // // console.log(err)
    }
  })
}

//to delete driver
exports.driverDelete = async (req, res) => {
  // // // console.log(req.params.id)

  connection.query('DELETE FROM drivers_details WHERE id = ?', [req.params.id], (err, result) => {
    if (!err) {
      res.json('deleted')
      // // // console.log(result)
    } else {
      // // // console.log(err)
    }
  })
}

//to Update driver
exports.driverUpdate = async (req, res) => {
  // // // console.log(req.params.id)

  connection.query('SELECT driver_name,fuel_card_name,licesnse_no,id,assigned_vehicle_name,email,status,phone,description,driver_name from drivers_details WHERE id = ?', [req.params.id], (err, result) => {
    if (!err) {
      res.json(result)
      // // // console.log('geted data')
    } else {
      // // // console.log(err)
    }
  })
}
// ---------------------------------------vehicle assignment--------------------------------------------------
//vehicle assignment
exports.vehicleAssignment = async (req, res) => {
  connection.query('SELECT * FROM vehicles_details', (err, result) => {
    if (!err) {
      res.status(200).send(result)
      // // // console.log('The data from users table are: \n', result)
    } else {
      // // // console.log(err)
      res.status(400).send(err)
    }
  })
}

//to get active user list
exports.allDrivers = async (req, res) => {
  connection.query('SELECT COUNT(*) FROM user WHERE status = ?', [0], (err, result) => {
    if (!err) {
      var data = JSON.parse(JSON.stringify(result))
      res.json(data)
      // // // console.log(data)
    } else {
      // // // console.log(err)
    }
  })
}

//to get active user list
exports.ActiveUserList = async (req, res) => {
  connection.query('SELECT * FROM drivers_details', (err, result) => {
    if (!err) {
      res.json(result)
      // // // console.log(result)
    } else {
      // // // console.log(err)
    }
  })
}

exports.CheckDeviceIdent = async (req, res) => {
  const id = req.params.id;

  connection.query('SELECT device_ident, make FROM vehicles_details WHERE device_ident = ?', [id], (err, result) => {
    if (!err) {
      if (result.length > 0) {
        const make = result[0].make;
        res.status(203).send(make);
      } else {
        const url = `https://flespi.io/gw/devices/${id}/messages?data=%7B%7D`;
        const token = process.env.FLESPI_API_KEY;
        const headers = {
          Authorization: `FlespiToken ${token}`,
        };

        axios.get(url, { headers })
          .then((response) => {
            console.log(response, "res");
            if (response.data) {
              res.status(200).send("valid");
            } 
          })
          .catch((error) => {
         
            res.status(204).send("not valid");
          });
      }
    } else {
      console.error(err);
      res.status(500).send("Database error");
    }
  });
};


exports.addVehicle = async (req, res) => {
  console.log(req.body,"body")

  connection.query('INSERT INTO vehicles_details SET ?', [req.body], (err, result) => {
    if (!err) {
      console.log(result)
      res.status(200).json('add Vehicle')

    } else if (err.code === 'ER_DUP_ENTRY') {
      console.log(result)

      res.status(203).json('unique')
    } else {
      console.log(err)

      res.status(210).json(err)
    }
  })
}

//to read single vehicle details by id
exports.vehicleUpdateId = async (req, res) => {
  // // // console.log(req.body.ID)

  connection.query(
    'SELECT * from vehicles_details WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (!err) {
        res.status(200).send(result)
        console.log('The data from users table are: \n', result)
      } else {
        console.log(err)
        res.status(400).send(err)
      }
    },
  )
}

//to update vehicle
exports.vehicleUpdateTreack = async (req, res) => {
  const id = req.body.id

  connection.query('UPDATE vehicles_details SET ? WHERE id = ?', [req.body, id], (err, result) => {
    if (!err) {
      res.json('updated')

    } else {

      res.status(400).send(err)
    }
  })
}

//to delete vehicle by id
exports.vehicleDelete = async (req, res) => {
  const id = req.params.id
  // // // console.log(id)

  connection.query('DELETE from vehicles_details WHERE id = ?', [req.params.id], (err, result) => {
    if (!err) {
      res.json('deleted')
      // // // console.log('The data from users table are: \n', result)
    } else {
      // // // console.log(err)
      res.status(400).send(err)
    }
  })
}

//to update driver
exports.driverUpdateId = async (req, res) => {
  const id = req.body.id

  connection.query('UPDATE drivers_details SET ? WHERE id = ?', [req.body, id], (err, result) => {
    if (!err) {
      res.json('updated')

    } else {
      // // // console.log(err)
      res.status(400).send(err)
    }
  })
}

exports.vehicleManagement = async (req, res) => {
  connection.query('SELECT * FROM vehicles_details', (err, result) => {
    if (!err) {
      res.status(202).json(result)
      // // // console.log('The data from users table are: \n', result)
    } else {
      // // // console.log(err)
      res.status(400).json(err.sqlMessage)
    }
  })
}
//Add new vehicle api
exports.vehicleDetails = async (req, res) => {
  const id = req.body.id

  connection.query('SELECT * from vehicles_details WHERE id = ?', [req.body.id], (err, result) => {
    if (!err) {
      res.json(result)
      // // // console.log('geted data')
    } else {
      // // // console.log(err)
    }
  })
}

// exports.vehicleDetails = async (req, res) => {
//     // // // console.log(req.body);
//     pool.getConnection((err, connection) => {
//     if (err) throw err
//         connection.query('INSERT INTO vehicles_details SET ?', [req.body], (err, result) => {
//         connection.release();
//             if (!err) {
//             res.json('Add Vehicles')
//             // // // console.log('The data from vehicles_details table are: \n', result);
//             }
//             else {
//             // // // console.log(err);
//             res.status(400).json(err.sqlMessage);
//             }
//             })
//         })
// }
//get user details
exports.getLogs = async (req, res) => {
  connection.query('SELECT * FROM notification_log', (err, result) => {
    if (!err) {
      res.status(203).json(result)
      // // // console.log('The data from notification_log table are: \n')
    } else {
      // // // console.log(err)
      res.status(400).send(err)
    }
  })
}

//get single user from id
exports.LoadNotificationUser = async (req, res) => {
  const id = req.params.id

  connection.query(
    'SELECT * from notifications WHERE user_id = ?',
    [req.params.id],
    (err, result) => {
      if (!err) {
        res.json(result)
        // // // console.log('The data from users table are: \n', result)
      } else {
        // // // console.log(err)
        res.status(400).send(err)
      }
    },
  )
}

// forgot password
// check whether email exits in database or not
exports.userExist = async (req, res) => {
  const username = req.body.user_email

  connection.query('SELECT * FROM user WHERE user_email = ?', [username], (err, result) => {
    console.log()
    if (result.length > 0) {
      res.status(203).json('User found')
    } else {
      res.status(201).json('user not exist')
    }
  })
}

//change this url to original one while deploying site
// const url = 'https://sincprojects.com'
// const url = 'http://localhost:3000'
const url = 'http://13.43.59.115'



const AuthMail = process.env.Email
const AuthPassword = process.env.Email_PassWord

const JWT_secret = process.env.JWT_SECRET

//send email
exports.sendMail = async (req, res) => {
  const userMail = req.query.user

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: AuthMail,
      pass: AuthPassword,
    },
  })

  const uniToken = `${JWT_secret}${userMail}`
  const payload = {
    email: userMail
  }
  const token = jwt.sign({ payload }, uniToken)
  const URL = `${url}/resetpassword?id=${userMail}&token=${token}`


  let info = await transporter.sendMail(
    {
      from: '"AuthorName"<developersweb001@gmail.com>', // sender address
      to: userMail, // list of receivers
      subject: 'Change password for Tyreoo', // Subject line
      // text: `Change password for Tyreoo`, // plain text body
      html: ` <div style="background-color:#ffffff">
    <center>
    <table style="width:560px;margin:0;padding:0;font-family:Helvetica,Arial,sans-serif;border-collapse:collapse!important;height:100%!important;background-color:#ffffff" align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="m_-6858922372745166746bodyTable">
		<tbody><tr>
		<td align="center" valign="top" id="m_-6858922372745166746bodyCell" style="margin:0;padding:0;font-family:Helvetica,Arial,sans-serif;height:100%!important">
			<div style="background-color:#ffffff;color:#202123;padding:27px 20px 0 15px">
			<p style="text-align:left;margin:0">
				<img src="../../public/tyreoo logo.png" width="560" height="168" alt="Tyreeo" title="" style="width:140px;height:auto;border:0;line-height:100%;outline:none;text-decoration:none" class="CToWUd a6T" data-bit="iit" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 579px; top: 34px;"><div id=":om" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Download attachment " jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB; 4:WyIjbXNnLWY6MTc2Mzc3NDMxMTEzNzA4MjE3NSIsbnVsbCxbXV0." data-tooltip-class="a1V" data-tooltip="Download"><div class="akn"><div class="aSK J-J5-Ji aYr"></div></div></div></div>
			</p>
			</div>
            <div style="background-color:#ffffff;color:#353740;padding:40px 20px;text-align:left;line-height:1.5">
              <h1 style="color:#202123;font-size:32px;margin:0 0 20px">Reset password</h1>

              <p>A password change has been requested for your account. If this was you, please use the link below to reset your password.</p>

              <p style="margin:24px 0 0;text-align:left">
              <a href= ${URL} style="display: inline-block;text-decoration: none;background: #FF1E1C;border-radius: 3px;color: white;font-family: Helvetica,sans-serif;font-size: 16px;line-height: 24px;font-weight: 400;padding: 12px 20px 11px;margin: 0px;" target="_blank" rel="noopener noreferrer"><span>Reset password</span></a>
			  </p>
            </div>
          </td>
        </tr>
      </tbody></table>
    </center>
</div>`, // html body
    },
    (err) => {
      if (err) {
        res.status(200).json(err)

      } else {
        res.status(201).json(info)


      }
    },
  )
}

// to check whether user is user is authentic or not to update password
exports.authUser = async (req, res) => {
  const jwt_token = req.body.token
  const sec_token = req.body.unitok

  try {
    jwt.verify(jwt_token, process.env.JWT_SECRET)
    res.status(200).json({ msg: 'done' })
  } catch (error) {
    res.status(201).json(error)

  }
}

//to update password

exports.forgotPassword = async (req, res) => {
  const Email = req.query.email
  const password = req.query.ps
  connection.query(
    'UPDATE user SET user_password = ? WHERE user_email = ?',
    [password, Email],
    (err, result) => {
      if (!err) {
        res.json('updated')
      } else {
        res.status(400).send(err)
      }
    },
  )
}

//add services
exports.addservices = async (req, res) => {

  // connection.query('UPDATE Maintenance SET ')
  connection.query('INSERT INTO maintenance SET ?', [req.body], (err, result) => {
    if (!err) {
      const registrationNumber = req.body.registrationNumber

      const query = `UPDATE vehicles_details SET status = 'In Maintenance' WHERE registrationNumber = ?`
      connection.query(query, [registrationNumber], (err, result) => {
        if (!err) {
          

          res.status(200).send(result)
        } else {

          res.status(400).send(err)
        }
      })
    } else {
      res.status(400).json(err.sqlMessage)
    }
  })
}

//get Maintenance List

exports.maintenancelist = async (req, res) => {
  connection.query('SELECT * FROM maintenance ORDER BY status ASC', (err, result) => {
    if (!err) {
      res.status(200).json(result)
    } else {
      res.status(400).json(err.sqlMessage)
    }
  })
}

//Remove Maintenance

exports.maintenanceVehicleDelete = async (req, res) => {
  const id = req.params.id
  // // console.log("Maintenance req Id", req.params.id);
  connection.query(
    'UPDATE  maintenance SET status= "1" WHERE id = ? ',
    [req.params.id],
    (err, result) => {
      // // console.log("maintenance remove result", result);

      if (!err) {
        const vehicleID = req.params.id
        // // console.log("Vehicle Id", vehicleID);

        const subquery = `SELECT registrationNumber FROM maintenance WHERE id = ?`

        connection.query(subquery, [vehicleID], (err, subqueryResult) => {
          if (!err && subqueryResult.length > 0) {
            const vehicleRegistrationNumber = subqueryResult[0].registrationNumber

            // Update the vehicles_details table using the obtained registration number
            const query = `UPDATE vehicles_details SET status = 'Idle' WHERE registrationNumber = ?`

            connection.query(query, [vehicleRegistrationNumber], (err, vehicleUpdateResult) => {
              if (!err) {
                // // console.log("Updated status", vehicleUpdateResult);
                res.status(200).send(vehicleUpdateResult)
              } else {
                // // console.log("Error in updating status data", err);
                res.status(400).send(err)
              }
            })
          } else {

            res.status(400).send(err)
          }
        })
      } else {
        res.status(400).send(err)
      }
    },
  )
}

//maintenance delete

exports.maintenanceServiceDelete = async (req, res) => {
  // // console.log("api called",req.body);
  const id = req.body.id
  const num = req.body.num

  connection.query(
    'UPDATE  vehicles_details SET status= "Idle" WHERE registrationNumber = ? ',
    [num],
    (err, result) => {

      if (!err) {
        // res.status(200).send(result)

        const id = req.body.id


        connection.query('DELETE from maintenance WHERE id = ?', [id], (err, result) => {
          if (!err) {
            res.json('deleted')
          } else {
            res.status(400).send(err)

          }
        })
      } else {
        res.status(400).send(err)

      }
    }
  )
}


//maintenance update api
exports.maintennaceUpdateId = async (req, res) => {
  // // console.log("maintenance id for get edit data",req.params.id)

  connection.query('SELECT * from maintenance WHERE id = ?', [req.params.id], (err, result) => {
    if (!err) {
      res.status(200).send(result)
      // // console.log('The data from maintenance table are: \n', result)
    } else {
      // // // console.log(err)
      res.status(400).send(err)
    }
  })
}

exports.editmaintennaceVehicle = async (req, res) => {
  const id = req.body.id

  connection.query('UPDATE maintenance SET ? WHERE id = ?', [req.body, id], (err, result) => {
    if (!err) {
      res.json('updated')

      console.log('The data from maintenance table after update are: \n', result)
    } else {
      console.log(err)
      res.status(400).send(err)
    }
  })
}

// ---------------------- For Garage -------------------------------------

//to get all garage
exports.garageList = async (req, res) => {
  connection.query('SELECT * FROM garage_details ', (err, result) => {
    if (!err) {
      res.json(result)
      // // // console.log(result)
    } else {
      // // // console.log(err)
    }
  })
}

//find garage by postcode
exports.findGarage = async (req,res) => {
  const postcode = req.body.postcode
  // // console.log("Entered postcode", req.body.postcode);
  const filterPostcode = postcode.replace(/\s+/g, '').toLowerCase();

  connection.query('SELECT * FROM garage_details WHERE garage_postcode = ?', [filterPostcode] ,(err, result) => {

    if (err) {
      // console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching garage details.' });
    } else {
      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(203).json({ message: 'Garage details not found for the entered postcode.' });
      }
    }
  })
}

// add garage
exports.addGarage = async (req, res) => {
  connection.query('INSERT INTO garage_details SET ?', [req.body], (err, result) => {
    if (!err) {
      res.status(200).json('add Vehicle')
      console.log(err)
    }
   else {
      res.status(210).json(err.sqlMessage)
      console.log(err)

    }
  })
}

//delete Garage
exports.deleteGarage = async (req, res) => {
  connection.query('DELETE FROM garage_details WHERE id = ?', [req.params.id], (err, result) => {
    if (!err) {
      res.json('deleted')
      // console.log(result)
    } else {
      // console.log(err)
    }
  })
}

//edite Garage
exports.editGarageId = async (req, res) => {
  // // console.log("maintenance id for get edit data",req.params.id)

  connection.query('SELECT * from garage_details WHERE id = ?', [req.params.id], (err, result) => {
    if (!err) {
      res.status(200).send(result)
      // // console.log('The data from maintenance table are: \n', result)
    } else {
      // // // console.log(err)
      res.status(400).send(err)
    }
  })
}

exports.updateGarage = async (req, res) => {
  const id = req.body.id
  console.log("id------",id,req.body);

  connection.query('UPDATE garage_details SET ? WHERE id = ?', [req.body, id], (err, result) => {
    if (!err) {
      res.json('updated')

      console.log('The data from garage table after update are: \n', result)
    } else {
      console.log(err)
      res.status(400).send(err)
    }
  })
}