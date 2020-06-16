const express = require('express')
const mongoose = require('mongoose');
const passport = require('passport');


const app = express();

// passport config 
 require('./config/passport')(passport);


// Load router ;
const auth = require('./routes/auth');
// const passport = require('./config/passport');





// Use Routes
app.use('/auth', auth);


app.get('/',(req, res)=>{
    res.send('welcome saikat');
    
})

// connecting port
const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`)
});