const express = require("express");

 //expressRouter keeps params separately, 
 //so as not to let it happen we should merge params
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("../schemas")
const Campground = require("../models/campground");
const Review = require("../models/review");

const validateReview = (req, res, next) => {
    const { error }  = reviewSchema.validate(req.body);
      if (error) {
        const msg = error.details.map(el => el.message).join(".")
        throw new ExpressError(msg, 400)
    }else {
        next();
    }
}

router.post("/", validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete("/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }}); //$pull = it pulls everything out of that ID
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router