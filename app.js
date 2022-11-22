if (process.env.NODE_ENV !== "production") {
    require('dotenv').config(); //apeleaza .env
}
//require('dotenv').config();
const express= require('express');
const path=require ('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const methodOverride = require('method-override');
const Joi=require('joi');
const ExpressError=require('./utils/ExpressError');
const Campground = require('./models/campground'); //facem conexiunea cu schema de baza de date
const Review=require('./models/review')
const userRoutes=require('./routes/users');
const campgroundRoutes=require('./routes/campground'); //conxiunea cu rutele
const reviewRoutes=require('./routes/reviews');
const session=require('express-session')
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const MongoDBStore=require('connect-mongo')(session);
//const dbUrl=process.env.dbUrl;

//'mongodb://localhost:27017/yelp-camp'

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app=express();

app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true})) //parse body
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith: '_'
}))
const secret = process.env.SECRET || 'worstsecret';    
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60 //pt a nu se updata mereu chiar daca nu e nev
});
  
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig={
    store,
    name:"proiect",
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true, //cookie urile sunt accesibile doar prin http
        expires: Date.now()+1000*60*60*24*7,    //data de azi transformata din milisecunde
        maxAge:1000*60*60*24*7
    }
    
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()) //how to store a user in a session
passport.deserializeUser(User.deserializeUser()) //how to get a user out of a sesion


//pt flash
app.use((req, res, next) => {
    console.log(req.query);
    res.locals.currentUser=req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

/*app.get('/fakeUser', async function(req,res){
    const user=new User({email:'carla@gmail.com',username:'carla17'});
   const newUser= await User.register(user, 'chicken') //baga user ul in baza de date, il inregistreaza|| chicken e parola
   res.send(newUser);
})*/

//folosim rutele
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);
app.use('/', userRoutes);

// am facut conexiunea cu home.ejs
app.get('/',function(req,res){
    res.render('home');
})




app.all('*',function(req,res,next){
   next(new ExpressError('Page not found',404))
})


//daca apare eroare
app.use(function(err,req,res,next){
    const{statusCode=505}=err;
    if(!err.message)
    err.messag="something went wrong";
    res.status(statusCode).render('error',{err});
})

// alegem portul
app.listen(3000,function(){ 
    console.log("Serving on port 3000");
})


//pagina unde se afiseaza datele
/*app.get('/makecampground', async function(req,res){
   const camp=new Campground({title: "My Backyard", price: "400"}); //salvam o data intr-o variabila
    await camp.save() //salvam in baza de date
    res.send(camp) //daca merge afisam
})*/
