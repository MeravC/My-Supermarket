var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var AccountRoutes = require('./controllers/accountController');
var HomeRoutes = require('./controllers/home');


var port = process.env.PORT || 3000;
const app = express();

app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({secret: 'randomstringsessionsecret'}));

app.use('/',AccountRoutes.AccountRoutes);

app.use(function(req,res,next){
    if(req.session.email == null || req.session.email.length ==0 ){
        res.redirect('/login'); 
    }
    else{
      next();
    }
  });
  app.use('/',HomeRoutes.HomeRoutes);

app.listen(port);

