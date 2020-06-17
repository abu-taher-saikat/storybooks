const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('./../helpers/auth');
const Stories = require('../models/Story');
const User = require('../models/User');

// Stories index
router.get('/',(req, res)=>{
    Stories.find({status : 'public'})
    .populate('user')
    .then(stories =>{
        res.render('stories/index',{
            stories : stories
        });

    })
})

// Add Story form
router.get('/add', ensureAuthenticated,(req, res)=>{
    res.render('stories/add');
})


// Process add story 
router.post('/', async (req, res)=>{
    // console.log(req.body);
    // res.send('hellow');
    try{
        let allowComments;
        if(req.body.allowComments){
            allowComments = true;
        }else{
            allowComments = false;
        }
    
        const newStory = {
            title : req.body.title,
            body : req.body.body,
            status : req.body.status,
            allowComments : allowComments,
            user : req.user.id
        }
    
        // create story 
        await new Stories(newStory)
        .save()
        .then(story =>{
            res.redirect(`stories/show/${story.id}`);
        })

    }catch(err){
        console.log(err);
    }
    
})

module.exports = router;