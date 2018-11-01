var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Userala         = require('./models/user.js'),
    passport        = require('passport'),
    localStrategy   = require('passport-local'),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    seedDB          = require("./seeds"),
    commentRoute    = require('./routes/comment.js'),
    indexRoutes     = require('./routes/index.js'),
    campRoutes      = require('./routes/campground.js'),
    methodOverride  = require('method-override'),
    flash           = require('connect-flash');

app.use(require('express-session')({
    secret:'bola is a cuckadoo',
    resave:false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Userala.authenticate()));
passport.serializeUser(Userala.serializeUser());
passport.deserializeUser(Userala.deserializeUser());
app.use(methodOverride('_method'));
    
    
mongoose.connect("mongodb://localhost/yelp_camp_v3");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
// __dirname refers to the directory
app.set("view engine", "ejs");
// seedDB();

app.use(flash());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    //req.user is what gives us acces to the user details.. and res.locals is on all our template
   
    next();

});


app.use('/', indexRoutes);
app.use('/campgrounds', campRoutes);
app.use('/campgrounds/:id/comments', commentRoute);





var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    var fam = server.address().family;

    console.log('node server is here,listening port http://%s:%s----%s', host, port, fam);
    
});

