const express = require('express');
const router = express.Router();
const User=require('../models/user');
const passport=require('passport');
const users = require('../cotrollers/users');
const LocalStrategy=require('passport-local');

//afisare pagina inregistrare
router.get('/register', users.renderRegister);

//creare user
router.post('/register',users.register);

//pagina de login
router.get('/login',users.renderLogin);

//verificare daca e logat
router.post('/login', passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}), users.login)

//te deloghezi
router.get('/logout', users.loggout);

module.exports=router;