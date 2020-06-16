const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require('path');



// fixing handlebars read data from mongo problem && Import function exported by newly installed node  
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access");


// Passport Config
require('./config/passport')(passport);

// Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

// Load keys
const keys = require('./config/keys');
const { patch } = require('./routes/auth');

// Map global promise
mongoose.Promise = global.Promise;
// mongoose connect
mongoose.connect(keys.mongoURI,{
  useUnifiedTopology : true,
  useNewUrlParser : true
}).then(()=> console.log('Mongo db connected')
).catch(err => console.log(err));

const app = express();


// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout : 'main',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');



app.use(cookieParser());
app.use(session({
  secret : 'secret',
  resave : false,
  saveUninitialized : false
}))

// passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Set global vars
app.use((req, res, next)=>{
  res.locals.user = req.user || null;
  next();
})

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


// Use Routes
app.use('/stories', stories);
app.use('/auth', auth);
app.use('/', index);




const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});