const express = require('express');

const router = express.Router()

module.exports = router;

const Model = require('../model/model');


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

//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
    try{
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by ID Method
router.get('/getOne/:id', (req, res) => {
    //res.send('Get by ID API')
    res.send(`Get by ID ${req.params.id}`)
})

//Update by ID Method
router.patch('/update/:id', (req, res) => {
    res.send('Update by ID API')
})

//Delete by ID Method
router.delete('/delete/:id', (req, res) => {
    res.send('Delete by ID API')
})