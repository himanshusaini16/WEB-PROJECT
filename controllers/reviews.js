const Review=require("../models/review");
const Listing=require("../models/listing");

module.exports.addReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
   // console.log(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","new Review Added!!");
   // console.log("New Review SAved");
    res.redirect(`/listings/${listing._id}`);
}
 
module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review is Deleted!!");
    res.redirect(`/listings/${id}`);
}