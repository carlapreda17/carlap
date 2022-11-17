const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register=async function(req,res,next){ //folosim ry and catch in cazul in care exista deja un cont sa nu-l mai faca
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
   
   
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login= function(req,res){ //verifica daca esti logat si intra in functie doar daca esti logat
    req.flash('success','welcome back!');
    const redirectUrl=req.session.returnTo || '/campgrounds'; 
    delete req.session.returnTo;
    res.redirect('/campgrounds');
}

module.exports.loggout=(req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
}