const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async function(req,res){ //cnv poate sa scrie review ul doar daca este logat
    const campground=await Campground.findById(req.params.id);
    const review= new Review(req.body.review) //face legatura cu form ul, salveaza ce date scriem
    review.author=req.user._id;
    campground.reviews.push(review); //il baga in campgrounds, face legatura intre obiecte
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
 }

 module.exports.deleteReview= async function(req,res){
    const{id,reviewId}=req.params
    await Campground.findByIdAndUpdate(id,{$pull:{reviews: reviewId}}) //din campground cautam obiectul coresp idului dupa cu pull scoatem reviewul coresp idului din tabela reviews
    await Review.findByIdAndDelete( reviewId);
   res.redirect(`/campgrounds/${id}`);
}
