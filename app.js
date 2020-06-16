const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const auth = require('./routes/auth');
// Load keys
const keys = require('./config/keys');

// Map global promise
mongoose.Promise = global.Promise;
// mongoose connect
mongoose.connect(keys.mongoURI,{
  useUnifiedTopology : true,
  useNewUrlParser : true
}).then(()=> console.log('Mongo db connected')
).catch(err => console.log(err));

const app = express();

app.get('/', (req, res) => {
  res.send('It Works!');
});

// Use Routes
app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});