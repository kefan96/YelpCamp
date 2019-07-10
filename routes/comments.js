const express = require("express");
const router = express.Router();
const Comment = require("../models/comment")


router.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        res.render("comments/new", {campground: foundCampground});
      }
    });
  });
  
  router.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
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
            res.redirect("/campgrounds/" + foundCampground._id);
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