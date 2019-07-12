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
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save(); 
            foundCampground.comments.push(comment);
            foundCampground.save();
            res.redirect("/campgrounds/" + foundCampground._id);
          }
        });
      }
    });
  });

  router.get("/:comment_id/edit", (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
  });

//   update route
router.put("/:comment_id", (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
})

router.delete("/:comment_id", (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, err => {
        if (err) return handleError(err);
        res.redirect("back");
    });
});

  function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }

module.exports = router;