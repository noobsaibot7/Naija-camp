var express = require('express'),
    router = express.Router(),
    Userala = require('../models/user.js'),
    passport = require('passport');

router.get("/", function(req, res){
    res.render("landing");
});



//AUTH ROUTES 
router.get('/register', function(req, res){
    res.render('authPage/signup')
});

// AUTH POST ROUTE
router.post('/register', function(req, res){
    Userala.register(new Userala({username: req.body.username}), req.body.password, function(err, user){
        // we dont add the password to the 
        if(err){
            req.flash('error', err.message);
            res.redirect('/register');
            
        }else{
            passport.authenticate('local')(req, res, function(){
                req.flash('success', 'Account successfully created '+ user.username);                                
                res.redirect('/campgrounds');
            });  
        }
    });
});

//LOGIN ROUTES
router.get('/login', function(req, res){
    res.render('authPage/login')
});

// LOGIN ROUTES
router.post('/login', passport.authenticate('local',{
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
    failureFlash:'Invalid username or password',
    successFlash:'Welcome'
}), function(req, res){
   
});



// LOG OUT ROOUTE
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'Log out successful');
    res.redirect('/campgrounds');
});


module.exports = router;