var express = require('express'),
    router = express.Router(),
    Campground  = require("../models/campground"),
    middleware = require('../middleware');

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author, price : price};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
            console.log(newlyCreated);
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new.ejs"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(req.user)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});
//Add Method-Override
//add edit route
router.get("/:id/edit", middleware.checkCampOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, found){
             res.render('campgrounds/edit', {found: found});
        });
    });
    
    


// update route
router.put("/:id", function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, found){
        if(err){
            res.redirect('back')
        }else{
            res.redirect('/campgrounds/'+req.params.id);
        }
    });

});

// add delete route
router.delete("/:id", middleware.checkCampOwnership, function(req,res){ 
    Campground.findByIdAndRemove(req.params.id, function(err, found){
        res.redirect('/campgrounds');
    });
});

// middlewares
// referenced in the  middlewares page

module.exports = router;



