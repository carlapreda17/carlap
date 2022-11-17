
const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String
});

const CampgroundSchema = new Schema({
    title: String,
images: [{
    url: String,
    filename: String
}],
    price: Number,
    description: String,
    location: String,
    author:{  //face legatura cu users 
        type:Schema.Types.ObjectId,
        ref:"User"
},
    reviews:[{  //face legatura cu reviews pt fiecare camprgound va fi un review
            type:Schema.Types.ObjectId,
            ref:"Review"
    }]
});


CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews  //stergem reviewul al carui id se gaseste in obiect
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);