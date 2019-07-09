const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const seedDB = require("./seed");

// let campgrounds = [
//   {name: "Korbel North Campground", image: "https://newhampshirestateparks.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg"},
//   {name: "Korbel East Campground", image: "https://newhampshirestateparks.reserveamerica.com/webphotos/NH/pid270015/1/540x360.jpg"},
//   {name: "Alton RV Park", image: "https://www.appletonmn.com/vertical/Sites/%7B4405B7C1-A469-4999-9BC5-EC3962355392%7D/uploads/campground_(2).jpg"}
// ]

seedDB();
mongoose.connect("mongodb+srv://Admin:5t6y7u8iYKF!@cluster0-mhbxn.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => {
  console.log("Connected to DB!");
}).catch(err => {
  console.log("ERROR: ", err.message);
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Campground.insertMany([
//   {name: "Korbel North Campground", image: "https://newhampshirestateparks.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg", description: "Bacon ipsum dolor amet short loin swine pancetta, cow beef shank frankfurter pork belly chuck picanha."},
//   {name: "Korbel East Campground", image: "https://newhampshirestateparks.reserveamerica.com/webphotos/NH/pid270015/1/540x360.jpg", description: "Kevin pork loin pig turducken ham hock capicola. Brisket swine leberkas drumstick. "},
//   {name: "Alton RV Park", image: "https://www.appletonmn.com/vertical/Sites/%7B4405B7C1-A469-4999-9BC5-EC3962355392%7D/uploads/campground_(2).jpg", description:"Landjaeger ham jerky jowl pork belly tongue leberkas, chuck chicken pig. "}
// ], err => {
//   if (err) return handleError(err);
// })


app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {campgrounds: allCampgrounds});
    }
  })
});

app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

app.post("/campgrounds", (req, res) => {
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

app.get("/campgrounds/:id", (req, res) => {
  // find the campground with provided ID
  // render show template with that campground
  Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("show", {campground: campground});
    }
  });
});

app.listen(3000, () => {
  console.log("Yelp Camp Listen on Port 3000");
});
