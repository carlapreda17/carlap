const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Review = require('../models/review');

const { reviewSchema } = require('../schemas.js');


const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.post('/', catchAsync( async function(req,res){
    const campground=await Campground.findById(req.params.id);
    const review= new Review(req.body.review) //face legatura cu form ul, salveaza ce date scriem
    campground.reviews.push(review); //il baga in campgrounds, face legatura intre obiecte
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
 }))
 
 
 //stergere review
 router.delete('/:reviewId',catchAsync( async function(req,res){
     const{id,reviewId}=req.params
     await Campground.findByIdAndUpdate(id,{$pull:{reviews: reviewId}}) //din campground cautam obiectul coresp idului dupa cu pull scoatem reviewul coresp idului din tabela reviews
     await Review.findByIdAndDelete( reviewId);
    res.redirect(`/campgrounds/${id}`);
 }))

 module.exports = router;