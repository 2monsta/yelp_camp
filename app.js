var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

//Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
})

var Campground = mongoose.model("Campground", campgroundSchema);


// HARD CODE TO CREATE CAMPGROUND
// Campground.create({
//     name: "YanYan",
//     image: "https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5259404.jpg"
// }, function(err, campground){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("Newly created campground");
//         console.log(campground);
//     }
// })




app.get("/", function(req, res){
   res.render("landing")
})

app.get("/campgrounds", function(req, res){
    //Get all campground from DB
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        }else{
             res.render("index", {campgrounds:campgrounds});
        }
    })
});

//convention to name the same as the get route
app.post("/campgrounds", function(req, res){
   //get data from form and add to campground array
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var newCampground = {name:name, image:image, description:desc};
   // create a new campground and save to database
   Campground.create(newCampground, function(err, newlyCreated){
      if(err){
          console.log(err);
      } else{
          res.redirect("/campgrounds"); //when we do redirect, it automatically goes to the get request.            
      }
   });
   //redirect back to campgrounds page
  
   
});


//form to submit a new campgrounds
app.get("/campgrounds/new", function(req,res){
    res.render("new");
});



//Shows - more infor about one campground
app.get("/campgrounds/:id", function(req,res){
    //find the campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            //render show that campground founded in campgrounds
            res.render("show", {campground: foundCampground});
        }
    })
    //render show template with that campground
    res.send("show");
});



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Started!");
});

// testing