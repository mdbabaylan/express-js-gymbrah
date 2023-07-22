const express = require('express');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
require('dotenv').config();

const router = express.Router()

module.exports = router;

const Model = require('../model/model');
const UserModel = require('../model/users');
const secretKey = process.env.SECRET_KEY;

//argon2 encryption replacement due to Linux AWS EB deployment issue
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
//async - await as usual

//Post with model
router.post('/post', async (req, res) => {
    const data = new Model({
        date: req.body.date,
        user_id: req.body.user_id,
        weight: req.body.weight
    });

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Save a user in MongoDB, target a different collection though (users)
router.post('/save-user', async (req, res) => {
    const data = new UserModel({
        user_id: req.body.user_id,
        password: await bcrypt.hashSync(req.body.password, salt)
    });

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//ok now you get the gist of it, time to play around, just copy/paste the sample json data and play with it later

//date formatter from 2023-07-05T00:00:00.000Z to 2023-July-05
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return formattedDate;
}

//Login page - show credentials for user_id 2, add dummy data to MONGO db for user_id 2
//Why add user_id 2? to let visitors explore your app, and to not let guests interfere with your actual weight progression

//Get all Method, weekly, monthly, yearly filter too
router.get('/getAll/:id', async(req, res) => {
    try{
        const data = await Model.find({user_id: req.params.id});
        //const data = await Model.find();
        const formattedData = [];

        data.forEach((x) => {
            let z = {};
            z.date = formatDate(x.date);
            z.name = formatDate(x.date);
            z.weight =  x.weight;
            z.uv = x.weight;
            formattedData.push(z);
          });

        res.json(formattedData);
    }catch (error) {
        res.status(400).json({message: error.message});
    }
})


//Issue JWT Token when login success
router.post('/login', async (req, res) => {
    try {
      const user_id = req.body.user_id;

      //get user data
      const user = await UserModel.findOne({ user_id });

      try {
        //havent tested creating new user and login after changing to encrypt, atleast you have done it despite being busy
        if (bcrypt.compareSync(req.body.password, user.password)) {
        //if (await argon2.verify(user.password, req.body.password)) { //check if encrypted password matches with string password
          // password match

          const token = jwt.sign({ user_id: user_id }, secretKey, { expiresIn: '2h' });

         //return Token here, save in localStorage in frontend for authentication, also extract the user_id value here
          res.json({ token });
        } else {
          // password did not match
          res.status(500).json({ message: 'Wrong user_id/password' });
          //res.json({ message: "Wrong user_id/password" });
        }
      } catch (err) {
        // internal failure
        res.status(500).json({ message: err.message });
      }
    } catch (error) {
      res.status(500).json({ message: 'An error occurred' });
    }
  });

//Update by ID Method
router.patch('/update/:id', (req, res) => {
    res.send('Update by ID API')
})

//Delete by ID Method
router.delete('/delete/:id', (req, res) => {
    res.send('Delete by ID API')
})