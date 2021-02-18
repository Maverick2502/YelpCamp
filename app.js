const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const engine = require("ejs-mate");
const { campgroundSchema, reviewSchema } = require("./schemas")
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const Review = require("./models/review");
const campgrounds = require("./routes/campgrounds")

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection; // for brevity
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

const validateReview = (req, res, next) => {
    const { error }  = reviewSchema.validate(req.body);
      if (error) {
        const msg = error.details.map(el => el.message).join(".")
        throw new ExpressError(msg, 400)
    }else {
        next();
    }
}

app.use("/campgrounds", campgrounds)

//Order matters!!!
app.get("/", (req, res) => {
    res.render("home")
});

app.post("/campgrounds/:id/reviews", validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete("/campgrounds/:id/reviews/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }}); //$pull = it pulls everything out of that ID
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));

app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404))
})

//Place at the end!!!
app.use((req, res) => {
    res.status(404).render("campgrounds/404")
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "Damn, Something Went Wrong Maan!"
    res.status(statusCode).render("campgrounds/404", { err });
});

app.listen(3000, () => {
    console.log("Your server is up and running");
}); 