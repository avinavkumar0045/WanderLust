const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review  = require("../models/review.js"); 
const Listing  = require("../models/listing.js"); 
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// Post Review Route // only post route for review cause we dont want to access revoews separately
router.post("/", validateReview ,isLoggedIn, wrapAsync(reviewController.createReview));
 
 // DELETE REVIEW Route
router.delete("/:reviewId" , isLoggedIn , isReviewAuthor, 
     wrapAsync(reviewController.destroyReview));

 module.exports = router ;

