const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment")

router.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/index", {campgrounds: allCampgrounds});
      }
    })
  });
  
  router.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
  });
  
  router.post("/campgrounds", (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
    Campground.create(newCampground, err => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/campgrounds");
      }
    });
  });
  
  router.get("/campgrounds/:id", (req, res) => {
    // find the campground with provided ID
    // render show template with that campground
    Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/show", {campground: campground});
      }
    });
  });

  module.exports = router;