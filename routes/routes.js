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

//Get all Method
router.get('/getAll', async(req, res) => {
    try{
        const data = await Model.find();
        res.json(data);
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