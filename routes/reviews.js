const express = require("express");
 //expressRouter keeps params separately, 
 //so as not to let it happen we should merge params
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("../schemas")
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const Campground = require("../models/campground");
const Review = require("../models/review");
const reviews = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router