/* eslint-disable */
const express = require('express')
const Routes = express.Router()
const {
  registerUser,
  loginAuth,
  vehicleAssignment,
  allDrivers,
  allUser,
  addVehicle,
  vehicleManagement,
  vehicleUpdateTreack,
  vehicleUpdateId,
  vehicleDelete,
  userDelete,
  userExist,
  userUpdate,
  userUpdateId, 
  driverList,
  driverDelete,
  driverUpdate,
  driverUpdateId,
  userProfileId,
  adddriver,
  getLogs,
  UsernameDropDownN,
  sendMail,
  forgotPassword,
  authUser,
  GetUserName,
  addservices,
  maintenancelist,
  maintenanceVehicleDelete,
  maintennaceUpdateId,
  editmaintennaceVehicle,
  maintenanceServiceDelete,
  garageList,
  addGarage,
  findGarage,
  deleteGarage,
  updateGarage,
  editGarageId,
  CheckDeviceIdent
} = require('../controller/controllerM1')
const { reportData, genReports, submitTripRequest, TripHistoryByName, AssignedVehicleDetails } = require('../controller/controllerM2')

const {  
  getNotification, 
  ArchiveNotification, 
  pushNotification,
  MarkAsReadMsg,
  clearAllMsg,
  deleteNotificationId,
  notificationCount,
  DriverAssignment,
  DriverUnassigned,
  TripHistoryData,
  LoadChartDataApi,
  DriverMaintenance,
  serviceUnassignedDriverApi,
  LoadTripHistoryData,
  EndTripApi,
  getDriverData,
  LoadDriverDataApi,
  LoadAllVehicle,
  DvlaRegisterNumber
} =  require('../controller/controllerM2')

//for login auth
Routes.post('/loginAuth', loginAuth)

//home page
Routes.get('/allDrivers', allDrivers)
Routes.get('/userProfileDetails/:id', userProfileId)
Routes.post('/UsernameDropDownN',UsernameDropDownN)
Routes.get('/GetUserName/:email',GetUserName)

//for user management
Routes.get('/userDetails', allUser)
Routes.post('/registerUser', registerUser)
Routes.get('/userDetails/:id', userUpdateId)
Routes.put('/userDetailsUpdate', userUpdate)
Routes.delete('/userDelete/:id', userDelete)

//for drivers
Routes.get('/driverList', driverList)
Routes.delete('/driverDelete/:id', driverDelete)
Routes.get('/driverUpdate/:id', driverUpdate)
Routes.put('/driverEditId', driverUpdateId)
Routes.post('/addDriver', adddriver)
Routes.post('/LoadDriverDataApi', LoadDriverDataApi)

//for vehicle management
Routes.post('/addVehicle', addVehicle)
Routes.get('/vehicleManagement', vehicleManagement)
Routes.get('/vehicleUpdateId/:id', vehicleUpdateId)
Routes.put('/vehicleUpdatetruck', vehicleUpdateTreack)
Routes.delete('/vehicleDelete/:id', vehicleDelete)
Routes.post('/DriverAssignment', DriverAssignment)
Routes.post('/DriverUnassigned', DriverUnassigned)
Routes.post('/LoadAllVehicle', LoadAllVehicle)
Routes.post('/CheckDeviceIdent/:id', CheckDeviceIdent)

//for dvla api
Routes.post('/DvlaRegisterNumber/:id', DvlaRegisterNumber)

//for notifications
Routes.get('/getNotification/:id', getNotification)
Routes.post('/PushNotificationUser/:msg', pushNotification)
Routes.post('/ArchiveNotification/:id',ArchiveNotification)
Routes.post('/clearAllMsg/:id',clearAllMsg)
Routes.post('/MarkAsReadMsg/:id',MarkAsReadMsg)
Routes.post('/deleteNotificationId/:id',deleteNotificationId)
Routes.get('/notification-count',notificationCount)

//forget password
Routes.post('/forgotpassword', userExist)
Routes.get('/sendmail', sendMail)
Routes.post('/confirmuser', authUser)
Routes.get('/updatePassword', forgotPassword)
Routes.post('/reportdata', reportData)
Routes.post('/genreports',genReports)

//Trip History
Routes.post('/submit-trip-request',submitTripRequest)
Routes.post('/trip-history',TripHistoryData)
Routes.get('/triphistorybyname/:operator',TripHistoryByName)

//Maintenance
Routes.post('/addServices', addservices)
Routes.post('/serviceUnassignedDriverApi/:id', serviceUnassignedDriverApi)
Routes.get('/maintenancelist', maintenancelist)
Routes.post('/maintenanceVehicleDelete/:id', maintenanceVehicleDelete)
Routes.get('/maintennaceUpdateId/:id', maintennaceUpdateId)
Routes.put('/editmaintennaceVehicle', editmaintennaceVehicle)
Routes.post('/maintenanceServiceDelete', maintenanceServiceDelete)

Routes.post('/DriverMaintenance', DriverMaintenance)

//chart data
Routes.get('/load-chart-data', LoadChartDataApi)

//Driver-Dashboard
Routes.post('/load-trip-historyData/:name', LoadTripHistoryData)
Routes.get('/assigned-vehicle/:operator', AssignedVehicleDetails )
Routes.post('/end-trip-api', EndTripApi)
Routes.post('/getDriverData/:id', getDriverData)

//for Garage
Routes.get('/garageList', garageList)
Routes.post('/addGarage', addGarage)
Routes.post('/findGarage', findGarage)
Routes.delete('/deleteGarage/:id', deleteGarage)
Routes.put('/updateGarage', updateGarage)
Routes.get('/editGarageId/:id', editGarageId)




module.exports = Routes
