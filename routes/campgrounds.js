const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware")
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const Campground = require("../models/campground");

router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array("images"), validateCampground, catchAsync(campgrounds.createCampground))


router.route("/new")
    .get(isLoggedIn, campgrounds.renderNewForm)

router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.route("/:id/edit")
    .get(isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router