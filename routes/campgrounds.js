const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

router.get("/", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/index", {campgrounds: allCampgrounds});
      }
    })
  });
  
  router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
  });
  
  router.post("/", middleware.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: description, author: author};
    Campground.create(newCampground, err => {
      if (err) {
        console.log(err);
      } else {
        req.flash("success", "New Campground Added!");
        res.redirect("/campgrounds");
      }
    });
  });
  
  router.get("/:id", (req, res) => {
    // find the campground with provided ID
    // render show template with that campground
    Campground.find({}, (err, allCampgrounds) => {
      if (err) {
        console.log(err);
      } else {
        Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
          if (err) {
            console.log(err);
          } else {
            res.render("campgrounds/show", {allCampgrounds: allCampgrounds, campground: campground});
          }
        });
      }
    });
  });

  router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/edit", {campground: foundCampground});
            }  
        });
    }
  });

  router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + updatedCampground._id);
        }
    });
  });

  router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, err => {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went Wrong!");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground Deleted!");
            res.redirect("/campgrounds");
        }
    });
  });

//   function isLoggedIn(req, res, next) {
//     if(req.isAuthenticated()) {
//       return next();
//     }
//     res.redirect("/login");
//   }

//   function checkCampgroundOwnership(req, res, next) {
//     if (req.isAuthenticated()) {
//         Campground.findById(req.params.id, (err, foundCampground) => {
//             if (err) {
//                 console.log(err);
//                 res.redirect("back");
//             } else {
//                 if (foundCampground.author.id.equals(req.user._id)) {
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