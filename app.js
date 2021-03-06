// // Deployment ready version of the CODE BELOW!!!!
// if (process.env.NODE_ENV !== "production") {
//     require("dotenv").config();
// }

// const express = require("express");
// const path = require("path");
// const mongoose = require("mongoose");
// const engine = require("ejs-mate");
// const session = require("express-session");
// const flash = require('connect-flash');
// const ExpressError = require("./utils/ExpressError");
// const methodOverride = require("method-override");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user");

// const mongoSanitize = require('express-mongo-sanitize');

// const userRoutes = require("./routes/users")
// const campgroundRoutes = require("./routes/campgrounds");
// const reviewRoutes = require("./routes/reviews");

// const MongoStore = require('connect-mongo').default;

// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

// mongoose.connect(dbUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false
// });

// const db = mongoose.connection; // for brevity
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("Database connected");
// });

// const app = express();

// // use ejs-locals for all ejs templates:
// app.engine('ejs', engine);

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// app.use(express.urlencoded({extended: true}));
// app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "public")));
// // To remove data, use:
// app.use(mongoSanitize());

// const secret = process.env.SECRET || "keep coding";

// const store = MongoStore.create({
//     mongoUrl: dbUrl,
//     secret,
//     touchAfter: 24 * 60 * 60
// });

// const sessionConfig = {
//     store,
//     name: "_asht",
//     secret,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         httpOnly: true,
//         expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//         maxAge:  1000 * 60 * 60 * 24 * 7
//     }
// }
// app.use(session(sessionConfig))
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session())
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use((req, res, next) => {
//     res.locals.currentUser = req.user;
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     next();
// });

// //Setting our routes!!!
// app.use("/", userRoutes);
// app.use("/campgrounds", campgroundRoutes)
// app.use("/campgrounds/:id/reviews", reviewRoutes)

// //Order matters!!!
// app.get("/", (req, res) => {
//     res.render("home")
// });

// app.all("*", (req, res, next) => {
//     next(new ExpressError("Page not found", 404))
// })

// //Place at the end!!!
// app.use((req, res) => {
//     res.status(404).render("campgrounds/404")
// });

// app.use((err, req, res, next) => {
//     const { statusCode = 500 } = err;
//     if(!err.message) err.message = "Damn, Something Went Wrong Maan!"
//     res.status(statusCode).render("campgrounds/404", { err });
// });

// //Defining 'port' for Heroku and for running on our 'localhost:3000'
// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//     console.log("Your server is up and running");
// }); 




//Localhost version with all saved seeds
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
console.log(process.env.SECRET);

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const engine = require("ejs-mate");
const session = require("express-session");
const flash = require('connect-flash');
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const mongoSanitize = require('express-mongo-sanitize');

const userRoutes = require("./routes/users")
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

const MongoStore = require('connect-mongo').default;

// const dbUrl = process.env.DB_URL;

const dbUrl = 'mongodb://localhost:27017/yelp-camp'

mongoose.connect(dbUrl, {
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
// To remove data, use:
app.use(mongoSanitize());

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: "keep coding",
    touchAfter: 24 * 60 * 60
});

const sessionConfig = {
    store,
    name: "_asht",
    secret: "maverick2502",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:  1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

//Setting our routes!!!
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/reviews", reviewRoutes)

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