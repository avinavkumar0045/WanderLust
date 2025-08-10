const Listing = require("./models/listing");
const Review  = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req , res , next)=>{
    if(!req.isAuthenticated()){ // if not logged in , send to the login page 
        req.session.redirectUrl = req.originalUrl; 
        req.flash("error","You must be logged in !!") ; 
        return res.redirect("/login");
    }
    next() ; // means if the user is autheticated then next .

};
//cause jaise hi login hoga passport uska session data delete kr dega , issliye uss redirect url ko locals mein store kara liya  
module.exports.saveRedirectUrl  =(req , res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// for the authorization for listing
module.exports.isOwner = async (req ,res ,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner !!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req , res , next)=>{ // passsing the validate listing also as a middleware 
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
     throw new ExpressError(400 , errMsg);
    }else{
        next();
    }
};

// shifting validate reviews into middleware 
module.exports.validateReview = (req , res , next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
     throw new ExpressError(400 , errMsg);
    }else{
        next();
    }
};

// for the authorization for reviews while deleting 
module.exports.isReviewAuthor = async (req ,res ,next)=>{
    let {id , reviewId} = req.params;
    let review = await Review .findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You didn't created this review !!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
