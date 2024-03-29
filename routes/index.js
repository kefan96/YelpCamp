const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/", (req, res) => {
    res.render("landing");
  });

// =============================
// AUTH ROUTES
// =============================

router.get("/register", (req, res) => {
    res.render("register");
  });
  
  // Sign Up Logic
  router.post("/register", (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
      if (err) {
        req.flash("error", err.message);
        res.redirect("/register");
      }
      passport.authenticate("local")(req, res, function(){
        req.flash("success", "Signed Up Successfully! Welcome, " + user.username);
        res.redirect("/campgrounds");
      });
    });
  });
  
  // show login form
  router.get("/login", (req, res) => {
    res.render("login");
  });
  
  // login logic
  router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), (req, res) => {
  });
  
  // log out route
  router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!")
    res.redirect("/campgrounds");
  });
  
  // function isLoggedIn(req, res, next) {
  //   if(req.isAuthenticated()) {
  //     return next();
  //   }
  //   res.redirect("/login");
  // }

  module.exports = router;