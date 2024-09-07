const express=require("express");
const router=express.Router({mergeParams:true});
const {listingSchema,reviewSchmea}=require("../schema.js");
const wrapAsync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/Expresseroor.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const {validateReview,isLoggedIn,isAuthor}=require("../middleware.js")
const reviewController=require("../controllers/reviews.js");

//add review
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.addReview));

//delete Review
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview));

 module.exports=router;