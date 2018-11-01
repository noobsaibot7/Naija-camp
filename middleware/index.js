var middleware = {},
    Campground = require('../models/campground.js'),
    Comment = require('../models/comment.js');

middleware.checkCampOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, found){
            if(err){
                res.redirect('back')
            }else{
                if(found.author.id.equals(req.user._id)){
                    return next();
                }else{
                    res.redirect('/campgrounds');
                }
            }
        });
    }else{
        res.redirect('back');
    }
}

middleware.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.com_id, function(err, found){
            if(err){
                res.redirect('back')
            }else{
                if(found.author.id.equals(req.user._id)){
                   next();
                }else{
                    res.redirect('/campgrounds/' + req.params.id);
                }
            }
        });
    }else{
        res.redirect('back');
    }
}
// middleware
middleware.isLoggedIn = function(req, res, next){
    if(!req.isAuthenticated()){
        res.redirect('/login');  
    }else{
        res.redirect('back');;
    }
}

module.exports = middleware;