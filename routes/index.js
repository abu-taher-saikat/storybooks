const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('./../helpers/auth');


router.get('/', ensureGuest,(req, res) => {
    // res.send('It Works!');
    res.render('index/welcome');
  });

router.get('/dashboard', ensureAuthenticated,(req, res) => {
    // res.send('Dashboard');
    res.render('index/dashboard')
  });
router.get('/about', (req, res) => {
    // res.send('Dashboard');
    res.render('index/about')
  });



module.exports = router;