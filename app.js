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
const reviews = require("./routes/reviews")

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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
app.use(express.static(path.join(__dirname, "public")));

//Setting our routes!!!
app.use("/campgrounds", campgrounds)
app.use("/campgrounds/:id/reviews", reviews)

//Order matters!!!
app.get("/", (req, res) => {
    res.render("home")
});

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