var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var passport = require('passport');
var cookieParser = require('cookie-parser');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
var bcrypt = require('bcryptjs');

var reimbursement = require('./reimbursement');
var maintenance = require('./maintenance');
var reimbursement = require('./reimbursement');
var loginRegister = require('./loginRegister.js');

var apartments = require('./apartments');
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  userObj.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username,password,done) {
    client.connect(url, function(err,db){
      var collection = db.collection('usersIK');
      collection.findOne({username:username}, function(err, user){
        if (err){return done(err);}
        if (!user){
          return done(null, false, {message: 'Incorrect username.'});
        }
        return done(null, user);
      });
    });
  }
));

// //backdate a jwt 30 seconds
// var older_token = jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 }, 'shhhhh');

// // sign with RSA SHA256
// //var cert = fs.readFileSync('private.key');  // get private key
// // var token = jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256'});
// cert = "secret";
// // sign asynchronously
// jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256' }, function(err, token) {
//   console.log(token);
// });
//---------------------------- END TOKENS ----------------------------

var reimbursement = require('./reimbursement');
var maintenance = require('./maintenance');
var reimbursement = require('./reimbursement');
var loginRegister = require('./loginRegister.js');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  userObj.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy( 
  function(username,password,done) {
    client.connect(url, function(err,db){
      var collection = db.collection('usersIK');
      collection.findOne({username:username}, function(err, user){
        if (err){return done(err);}
        if (!user){
          return done(null, false, {message: 'Incorrect username.'});
        }
        return done(null, user);
      });
    });
  }
));

var app = express();

var mongo = require('mongodb');
var client = mongo.MongoClient;
var url = 'mongodb://innkeeper:inn123@ds017636.mlab.com:17636/rlms';
var ObjectID = mongo.ObjectID;

var userObj = { //A model of our users
  username: {
            type: String,
            index: true
  },
  password: {type: String},
  email: {type: String},
  fname: {type: String},
  lname: {type: String},
  isAdmin: {type: String},
  aptId: {type: String},
  batch: {type: String}
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  var allowedOrigins = ['http://127.0.0.1:3000', 'http://localhost:3000', 'http://ec2-54-218-76-216.us-west-2.compute.amazonaws.com', 'http://ec2-54-218-76-216.us-west-2.compute.amazonaws.com:3030', 'http://ec2-54-218-76-216.us-west-2.compute.amazonaws.com:3000'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});

app.get('/maintenanceCheck', maintenance.getAllTickets);
app.get('/maintenanceCheck/:usr', maintenance.getTicketsByUser); 
app.get('/maintenanceTicket/:ticket_id', maintenance.getTicketById);
app.post('/maintenanceCheck', maintenance.submitNewTicket);
app.post('/maintenanceUpdate', maintenance.updateTicket);

app.get('/apartments', apartments.findAllApartments);
app.get('/apartments/:aptId', apartments.findApartmentsByAptId);
app.post('/apartments', apartments.addApartment);
app.post('/apartments/:aptId/:userName',apartments.updateApartment);

app.get('/reimbursements', reimbursement.findAllReimbursements);
app.get('/reimbursements/:id', reimbursement.findReimbursementById);
app.get('/reimbursement/:username', reimbursement.findReimbursementsByUsername);
app.post('/reimbursements', reimbursement.addReimbursement);
app.post('/reimbursements/:id/:decision',reimbursement.updateReimbursement);

app.get('/login/:userName' , loginRegister.getUserByUsername); //finds a single user based on username
app.get('/comparePassword/:password' , loginRegister.comparePassword); //compares user password to password typed in for login
app.post('/createUser' , loginRegister.createUser); //create a new user
app.get('/login', loginRegister.allUsernames); // find all usernames

app.get('/logout', function(req, res){ //passports logout function
  req.logout();
  res.redirect('/');
});
//checks to see if the user is currently logged in
//stops from going to pages without access too
function ensureAuthenticated(req, res, next) { 

  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};

//passports login function, if an err, return the error, if no user returns you to login page
//if user found then return status 200 and the user.
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { 
      return res.redirect('/login'); 
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      res.status(200).json({
       user
     });
    });
  })(req, res, next);
});

module.exports = app;

app.listen(3030);

console.log('Listening on port 3030...');