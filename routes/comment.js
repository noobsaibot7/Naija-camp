var express     = require('express'),
    router      = express.Router({mergeParams:true}),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    middleware = require('../middleware');

    router.get('/new', middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, found){
        if (err){
            console.log('not found');
            
        }else{ 
             res.render('comment/new', {found:found});
        }
    })

});


router.post('/', middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){

        if(err){
            console.log('not found');
            res.redirect('/campgrounds');
        }else{ 
             Comment.create(req.body.comment, function(err, created){
                if(err){
                    console.log('comment not created'); 
                }else{
                    // set id and username from our req.user
                    created.author.username = req.user.username;
                    created.author.id = req.user._id;
                    created.save()
                    campground.comments.push(created);
                    campground.save();
                    console.log(created);
                    res.redirect('/campgrounds/'+campground._id);
                }
            });
        }    
    });
});

// ===== comment edit route
//campgrounds/:id/comments
router.get('/:com_id/edit', middleware.checkCommentOwnership, function(req, res){
Comment.findById(req.params.com_id, function(err, got){
    res.render('comment/edit', {campground:req.params.id, found:got})
    // the two parameters we name in the edit file, we passed their values through objects
    });
});

//comment update route
router.put('/:com_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.com_id, req.body.comment, function(err, found){
        res.redirect('/campgrounds/' + req.params.id);
       
    });
});

// delete route
router.delete('/:com_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.com_id, function(err, found){
        res.redirect('back');

    });
});

// middlewares
// referenced in the  middlewares page

module.exports = router;