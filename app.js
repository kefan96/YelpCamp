const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const seedDB = require("./seed");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");
const methodOverride = require("method-override");
const flash = require("connect-flash");

// let campgrounds = [
//   {name: "Korbel North Campground", image: "https://newhampshirestateparks.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg"},
//   {name: "Korbel East Campground", image: "https://newhampshirestateparks.reserveamerica.com/webphotos/NH/pid270015/1/540x360.jpg"},
//   {name: "Alton RV Park", image: "https://www.appletonmn.com/vertical/Sites/%7B4405B7C1-A469-4999-9BC5-EC3962355392%7D/uploads/campground_(2).jpg"}
// ]

mongoose.connect("mongodb+srv://Admin:5t6y7u8iYKF!@cluster0-mhbxn.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => {
  console.log("Connected to DB!");
}).catch(err => {
  console.log("ERROR: ", err.message);
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

app.use(require("express-session")({
  secret: "Jake wins cutest dog!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Campground.insertMany([
//   {name: "Korbel North Campground", image: "https://newhampshirestateparks.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg", description: "Bacon ipsum dolor amet short loin swine pancetta, cow beef shank frankfurter pork belly chuck picanha."},
//   {name: "Korbel East Campground", image: "https://newhampshirestateparks.reserveamerica.com/webphotos/NH/pid270015/1/540x360.jpg", description: "Kevin pork loin pig turducken ham hock capicola. Brisket swine leberkas drumstick. "},
//   {name: "Alton RV Park", image: "https://www.appletonmn.com/vertical/Sites/%7B4405B7C1-A469-4999-9BC5-EC3962355392%7D/uploads/campground_(2).jpg", description:"Landjaeger ham jerky jowl pork belly tongue leberkas, chuck chicken pig. "}
// ], err => {
//   if (err) return handleError(err);
// })

app.listen(3000, () => {
  console.log("Yelp Camp Listen on Port 3000");
});
