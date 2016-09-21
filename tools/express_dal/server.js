var express = require('express');

var bodyParser = require('body-parser');

var app = express();

var reimbursement = require('./reimbursement');

var maintenance = require('./maintenance');

var projections = require('./projections');

var apartments = require('./apartments');

app.use(function(req, res, next) {
  var allowedOrigins = ['http://127.0.0.1:3000', 'http://localhost:3000'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});

app.use(bodyParser.json());

app.get('/reimbursements', reimbursement.findAllReimbursements);
app.get('/reimbursements/:id', reimbursement.findReimbursementById);
app.post('/reimbursements', reimbursement.addReimbursement);
app.post('/reimbursements/:id/:decision',reimbursement.updateReimbursement);

app.get('/apartments', apartments.findAllApartments);
app.get('/apartments/:aptId', apartments.findApartmentsByAptId);
app.post('/apartments', apartments.addApartment);
app.post('/apartments/:aptId/:userName',apartments.updateApartment);

//app.get('/maintenance', maintenance.findAllTickets);
//app.get('/maintenance/:userName', maintenance.findTicketByUser);
//app.get('/maintenance', maintenance.getAllCategories);
//app.get('/maintenance', maintenance.getAllApartments);
//app.post('/maintenance', maintenance.submitNewTicket);
//app.post('/maintenance/:id', maintenance.updateTicket)

//app.get('/projections', projections.getAllBatches);
//app.get('/projections', projections.getAllApartments);

app.listen(3030);
console.log('Listening on port 3030...');
