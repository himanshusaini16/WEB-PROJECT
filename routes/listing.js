const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/Expresseroor.js")
const {listingSchema,reviewSchmea}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer')
const{storage}=require("../cloudConfig.js");
const upload = multer({storage})

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("Listing[image]"), validateListing,wrapAsync(listingController.createNewListing));
    
router.get("/new",isLoggedIn,listingController.renderNewForm);
router.get("/search",wrapAsync(listingController.searchResult));

router
    .route("/:id")
    .get(wrapAsync(listingController.show))
    .put(isLoggedIn,isOwner,upload.single("Listing[image]"),validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListingForm));

module.exports=router;