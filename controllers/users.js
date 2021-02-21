const User = require("../models/user");
const passport = require("passport");

module.exports.renderRegister = (req, res) => {
    res.render("users/register")
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", `Welcome to YelpCamp, ${username}`);
            res.redirect("/campgrounds");
            console.log(req.body);
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("register");
    }
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login");
}

module.exports.login = (req, res) => {
        const { username } = req.body;
        req.flash("success", `Welcome back, ${username}`);
        const redirectUrl = req.session.returnTo || "/campgrounds";
        delete req.session.returnTo;
        res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    const { username } = req.body;
    req.logout();
    req.flash("success", "Goodbye")
    res.redirect("/campgrounds")
}