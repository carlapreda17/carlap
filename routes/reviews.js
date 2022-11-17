const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../cotrollers/reviews');

const { reviewSchema } = require('../schemas.js');


const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');



router.post('/', isLoggedIn,catchAsync(reviews.createReview));
 
 
 //stergere review
 router.delete('/:reviewId',isLoggedIn, isReviewAuthor,catchAsync(reviews.deleteReview));

 module.exports = router;