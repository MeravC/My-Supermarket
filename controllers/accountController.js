
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const session = require('express-session');
const models = require('../models');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

let accountRoutes = express.Router();

accountRoutes.get('/login',function(req,res){
    console.log("get");
    res.render('account/login',{error: req.session.error});
    delete res.session.error; // remove from further requests
});

accountRoutes.post('/login',function(req,res){
    console.log("post");
    var matched_users_promise = models.User.findAll({
        where: Sequelize.and(
            {email: req.body.email},
        )
    });
    matched_users_promise.then(function(users){ 
        if(users.length > 0){
            let user = users[0];
            let passwordHash = user.password;
            if(bcrypt.compareSync(req.body.password,passwordHash)){
                req.session.email = req.body.email;
                res.redirect('/');
            }
            
            else{
                req.session.error = 'Incorrect password';
                res.redirect('/login');
            }
        }
        else{
            req.session.error = 'Incorrect email';
            res.redirect('/login');
        }
    });
});





accountRoutes.get('/register',function(req,res){  
    res.render('account/register',{errors: ""});
});


accountRoutes.post('/register',function(req,res){
    var matched_users_promise = models.User.findAll({
        where:  Sequelize.or(
                {username: req.body.username},
                {email: req.body.email}
            )
    });
    matched_users_promise.then(function(users){ 
        if(users.length == 0){
            const passwordHash = bcrypt.hashSync(req.body.password,10);
            models.User.create({
                username: req.body.username,
                email: req.body.email,
                password: passwordHash
            }).then(function(){
                let newSession = req.session;
                newSession.email = req.body.email;
                res.redirect('/');
            });
        }
        else{
            res.render('account/register',{errors: "Username or Email already in user"});
        }
    })
});


module.exports = {"AccountRoutes" : accountRoutes};
