const cities=require('./cities')//facem conexiunea cu schema de baza de date+declarare nume vector
const {places,descriptors}=require('./seedHelpers');
const mongoose=require('mongoose');
const Campground = require('../models/campground'); //facem conexiunea cu schema de baza de date +iesim din date ..
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl, {
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
                author:"6375d225075f257bd893fa08",
                location: `${cities[random1000].city}, ${cities[random1000].state}`, //luam elementele de pe pozitia nr extras
                title: `${sample(descriptors)} ${sample(places)}`,
                
                description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem eaque, mollitia quis, doloremque aliquam neque sunt consequatur vero officia provident saepe ipsum facilis esse blanditiis dolorum unde aut? Maxime, nobis!',
                price:price,
                images:[{
                    url: 'https://res.cloudinary.com/dnaeinjce/image/upload/v1668774213/YelpCamp/c67mtdc5poweharj20nk.jpg',
                    filename: 'YelpCamp/c67mtdc5poweharj20nk'
                },
                {
                   url: 'https://res.cloudinary.com/dnaeinjce/image/upload/v1668774213/YelpCamp/rsikpemjr58udeamgkf9.jpg',
                    filename: 'YelpCamp/rsikpemjr58udeamgkf9'
                }]
               

            })
            await camp.save(); //salveaza
    }
    
}

seedDB(); //executa functia