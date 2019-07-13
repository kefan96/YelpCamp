const express = require("express");
const router = express.Router({mergeParams: true});
const Comment = require("../models/comment");
const Campground = require("../models/campground");
const middleware = require("../middleware");


router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        res.render("comments/new", {campground: foundCampground});
      }
    });
  });
  
  router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if(err) {
        console.log(err);
        req.flash("error", "Something Went Wrong!");
        res.redirect("/campgrounds")
      } else {
        Comment.create(req.body.comment, (err, comment) => {
          if (err) {
            req.flash("error", "Something Went Wrong!");
            console.log(err);
          } else { 
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save(); 
            foundCampground.comments.push(comment);
            foundCampground.save();
            req.flash("success", "New Comment Added!");
            res.redirect("/campgrounds/" + foundCampground._id);
          }
        });
      }
    });
  });

  router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went Wrong!");
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
  });

//   update route
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went Wrong!");
            res.redirect("back");
        } else {
          req.flash("success", "Updated Comment!");
          res.redirect("/campgrounds/" + req.params.id);
        }
    });
})

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, err => {
        if (err) return handleError(err);
        req.flash("success", "Successfully Deleted!");
        res.redirect("back");
    });
});

//   function isLoggedIn(req, res, next) {
//     if(req.isAuthenticated()) {
//       return next();
//     }
//     res.redirect("/login");
//   }

//   function checkCommentOwnership(req, res, next) {
//     if (req.isAuthenticated()) {
//         Comment.findById(req.params.comment_id, (err, foundComment) => {
//             if (err) {
//                 console.log(err);
//                 res.redirect("back");
//             } else {
//                 if (foundComment.author.id.equals(req.user._id)) {
//                     next();
//                 } else {
//                     res.redirect("back");
//                 }
//             }
//         });
//     } else {
//         res.redirect("back");
//     }
//   }

module.exports = router;