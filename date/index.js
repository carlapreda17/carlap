const cities=require('./cities')//facem conexiunea cu schema de baza de date+declarare nume vector
const {places,descriptors}=require('./seedHelpers');
const mongoose=require('mongoose');
const Campground = require('../models/campground'); //facem conexiunea cu schema de baza de date +iesim din date ..

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

function sample(array){
     return array[Math.floor(Math.random()*array.length)]; //alegem un nr random dintr-un vetor de n elemente si returnam valoarea sa
}

async function seedDB() {
    await Campground.deleteMany({}); //elibereaza baza de date
    for(let i=0; i<50; i++){
            const random1000=Math.floor(Math.random()*1000); //luam un nr random din 1000
            const price=Math.floor(Math.random()*30);
           const camp = new Campground({
                location: `${cities[random1000].city}, ${cities[random1000].state}`, //luam elementele de pe pozitia nr extras
                title: `${sample(descriptors)} ${sample(places)}`,
                image:'https://images.unsplash.com/photo-1518602164578-cd0074062767?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw0ODMyNTF8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60',
                description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem eaque, mollitia quis, doloremque aliquam neque sunt consequatur vero officia provident saepe ipsum facilis esse blanditiis dolorum unde aut? Maxime, nobis!',
                price:price

            })
            await camp.save(); //salveaza
    }
    
}

seedDB(); //executa functia