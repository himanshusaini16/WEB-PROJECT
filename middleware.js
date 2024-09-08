const Listing=require("./models/listing");
const ExpressError=require("./utils/Expresseroor");
const Review=require("./models/review.js");
const {listingSchema,reviewSchmea}=require("./schema");

module.exports.isLoggedIn=(req,res,next)=>
{
    if(!req.isAuthenticated())
        {
        req.session.redirectUrl=req.originalUrl;
         req.flash("error","You Must be loged in to create listings");
         return res.redirect("/login");   
    } 
    next();  
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async  (req,res,next)=>
{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let currUser=req.user;
    if( currUser && !listing.owner._id.equals(currUser._id))
    {
        req.flash("error","You Are not Owner of Listing!!");
        return res.redirect(`/listings/${id}`); 
    }
    next();
}


module.exports.validateListing=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};


//reviews
module.exports.validateReview=(req,res,next)=>{
    let {error}= reviewSchmea.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

module.exports.isAuthor=async  (req,res,next)=>
    {
        let {id,reviewId}=req.params;
        let review=await Review.findById(reviewId);
        let currUser=req.user;
        if( currUser && !review.author._id.equals(currUser._id))
        {
            req.flash("error","You Are not Author of this review!!");
            return res.redirect(`/listings/${id}`); 
        }
        next();
    }