const express = require("express");
const router = express.Router({mergeParams: true});
const Comment = require("../models/comment");
const Campground = require("../models/campground");


router.get("/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        res.render("comments/new", {campground: foundCampground});
      }
    });
  });
  
  router.post("/", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if(err) {
        console.log(err);
        res.redirect("/campgrounds")
      } else {
        Comment.create(req.body.comment, (err, comment) => {
          if (err) {
            console.log(err);
          } else {
            foundCampground.comments.push(comment);
            foundCampground.save();
            res.redirect("/" + foundCampground._id);
          }
        });
      }
    });
  });

  function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }

module.exports = router;