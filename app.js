const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');



// fixing handlebars read data from mongo problem && Import function exported by newly installed node  
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access");

// Load Model
require('./models/User')
require('./models/Story');


// Passport Config
require('./config/passport')(passport);

// Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

// Load keys
const keys = require('./config/keys');
const { patch } = require('./routes/auth');

// Handlebars Helpers
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon
} = require('./helpers/hbs');

// Map global promise
mongoose.Promise = global.Promise;
// mongoose connect
mongoose.connect(keys.mongoURI,{
  useUnifiedTopology : true,
  useNewUrlParser : true
}).then(()=> console.log('Mongo db connected')
).catch(err => console.log(err));

const app = express();

// using body parser
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));


// Handlebars Middleware
app.engine('handlebars', exphbs({
  helpers :{
    truncate : truncate,
    stripTags : stripTags,
    formatDate : formatDate,
    select : select,
    editIcon : editIcon
  },
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