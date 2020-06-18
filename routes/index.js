const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('./../helpers/auth');
const Story = require('./../models/Story');



router.get('/', ensureGuest,(req, res) => {
    // res.send('It Works!');
    res.render('index/welcome');
  });

router.get('/dashboard', ensureAuthenticated,(req, res) => {
    // res.send('Dashboard');
    Story.find({user : req.user.id})
    .then(stories =>{
      res.render('index/dashboard',{
        stories : stories
      })
    })
  });
router.get('/about', (req, res) => {
    // res.send('Dashboard');
    res.render('index/about')
  });



module.exports = router;