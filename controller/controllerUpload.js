/* eslint-disable */
const express = require('express');
const routerUpload = express.Router();
const connection = require('../database/database')
const multer = require('multer')
const path = require('path');
const fs = require('fs')
require('dotenv').config()

routerUpload.use("/licenseImage", express.static("../public/Driver-img"))

//register user
routerUpload.get('/getImages/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT user_file_data FROM user WHERE id = ?';
  connection.query(sql, [id], (err, result) => {
    if (err) throw err;
    log(err)
    // console.log(result[0].user_file_data,"img path");
    res.send(result[0].user_file_data);
  });
})


//Upload License Image Api
const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/Driver-img/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload1 = multer({ storage: storage1 });

routerUpload.post('/api/upload-driver-img', upload1.array('image', 3), (req, res) => {

  const driverID = req.body.driverId;

  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  // Fetch existing image filenames from the database
  connection.query('SELECT license_img FROM drivers_details WHERE id = ?', [driverID], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch existing images' });
      return;
    }

    let existingImages = [];
    if (rows.length > 0) {
      // existingImages = rows[0].license_img.split(','); // Split existing image filenames
      existingImages = rows[0].license_img ? rows[0].license_img.split(',') : [];
    }

    const newImages = req.files.map((file) => file.filename);
    const totalImages = existingImages.length + newImages.length;

    if (totalImages > 3) {
      return res.status(400).json({ error: 'Only 3 images can be uploaded.' });
    }

    const updatedImages = existingImages.concat(newImages); // Append new images to existing ones

    // Update the database with the updated list of image filenames
    connection.query('UPDATE drivers_details SET license_img = ? WHERE id = ?', [updatedImages.join(','), driverID], (updateErr, result) => {
      if (updateErr) {
        res.status(500).json({ error: 'Failed to upload image' });
        return;
      }
      res.status(200).send({ message: 'Image(s) uploaded successfully!' });
    });
  });

});


//Delete Image API
routerUpload.post('/license-img-delete', (req, res) => {

  const NewLicenseImage = req.body.NewLicenseImage
  const array = [req.body.NewLicenseImage]
  const imageFileName = req.body.deleteImageName;
  const id = req.body.driverID
  // NoPacks = NewLicenseImage.replace(/,\s*$/, '');
  console.log(NewLicenseImage, "R")
  const test1 = NewLicenseImage.join(',')
  console.log(test1, "testq")

  // const test = NewLicenseImage.Replace()

  // val = 1694611708794-image19-7.webp, 1694611874472-image19-7.webp
  // Delete the image record from the database
  query = 'DELETE FROM drivers_details WHERE id = ? AND FIND_IN_SET(?, license_img)'
  connection.query(`UPDATE drivers_details SET license_img = ? WHERE id = ${id}`, [test1], (deleteErr, result) => {
    if (deleteErr) {
      console.log(deleteErr, 'deleteErr')
      res.status(500).json({ error: 'Failed to delete image record from the database' });
      return;
    }
    else {
      const imagePath = path.join('./public/Driver-img/', imageFileName);
      fs.unlink(imagePath, (unlinkErr) => {
        if (unlinkErr) {
          res.status(500).json({ error: 'Failed to delete image file from the folder' });
          return;
        }
      });
    }

    res.status(200).send({ message: 'Image deleted successfully!' });

  });
});

// profile upload api
const storage = multer.memoryStorage();
const uploadImg = multer({ storage });

routerUpload.post('/api/profileUpload', uploadImg.single('image'), (req, res) => {

  // console.log("api called",res);
  const userId = req.body.userId;

  if (!req.file) {
    res.status(400).json({ error: 'No image uploaded' });
    return;
  }
  const base64Image = req.file.buffer.toString('base64');
  // console.log("Base64 Image data",base64Image);

  const query = 'UPDATE user SET profilePicture = ? WHERE id = ?';
  connection.query(query, [base64Image, userId], (err, result) => {
    if (err) {
      console.log(err, "err")
      res.status(500).json({ error: 'Failed to upload image' });
      return;
    }

    res.json({ message: 'Image uploaded successfully!' });
  });
});

module.exports = routerUpload;