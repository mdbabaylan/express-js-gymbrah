const express = require('express');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

const router = express.Router()

module.exports = router;

const Model = require('../model/model');
const UserModel = require('../model/users');
const secretKey = "secretKey";

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
        password: await argon2.hash(req.body.password) //argon2 hash more secure says gpt3
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
router.get('/getAll', async(req, res) => {
    try{
        const data = await Model.find();
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
router.get('/login/:user_id', async (req, res) => {
    try {
      const user_id = req.params.user_id;
      const user = await UserModel.findOne({ user_id });

      try {
        if (await argon2.verify(user.password, "deez nuts")) {
          // password match
          res.status(200).json({ message: 'Match' });
          //add JWT logic here

          //return Token here
        } else {
          // password did not match
          res.status(500).json({ message: 'Wrong user_id/password' });
        }
      } catch (err) {
        // internal failure
        res.status(500).json({ message: err.message });
      }

      res.json(user);
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