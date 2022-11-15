const express = require('express');
const router = express.Router();
const User=require('../models/user');
const passport=require('passport');
const LocalStrategy=require('passport-local');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register',async function(req,res,next){ //folosim ry and catch in cazul in care exista deja un cont sa nu-l mai faca
    try{
        const {email,username,password}=req.body; //scoatem datele introduse
        const user=new User({email,username}) //facem un obiect nou
        const registeredUser= await User.register(user,password); //hasham parola
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
   
   
})
router.get('/login',function(req,res){
    res.render('users/login');
})
router.post('/login', passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),function(req,res){ //verifica daca esti logat si intra in functie doar daca esti logat
    req.flash('success','welcome back!');
    const redirectUrl=req.session.returnTo || '/campgrounds'; 
    delete req.session.returnTo;
    res.redirect('/campgrounds');
})
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
})

module.exports=router;