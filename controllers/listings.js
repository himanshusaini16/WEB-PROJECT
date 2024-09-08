const Listing=require("../models/listing.js");
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken});


module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.createNewListing=async (req,res)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.Listing.location,
        limit: 1
      })
        .send()
    console.log(response.body.features[0].geometry);
    let url=req.file.path;
    let filename=req.file.filename;
   const newListing=new Listing(req.body.Listing);
   newListing.owner=req.user._id
   newListing.image={url,filename};
   newListing.geometry=response.body.features[0].geometry;
   let savedListing=await newListing.save();
   req.flash("success","New Listing Created!!");
   res.redirect("/listings");

};

module.exports.show=async (req,res)=>{
    let {id}=req.params;
  const listing= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  if(!listing)
  {
    req.flash("error","Listing you Requested for Doest not exit");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs",{listing});

};

module.exports.editListingForm=async(req,res)=>{
    let {id}=req.params;
    
    const listing= await Listing.findById(id);
    if(!listing)
        {
          req.flash("error","Listing you Requested for Doest not exit");
          res.redirect("/listings");
        }
        let originalImageUrl=listing.image.url;
        originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    if(typeof req.file !=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    listing.geometry=response.body.features[0].geometry;
    await listing.save();
    }
    req.flash("success","Listing is Updated!!");
    res.redirect(`/listings/${id}`);  
};

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    const deletedListing= await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is Deleted!!");
    res.redirect("/listings");
};

module.exports.searchResult=async (req,res)=>{
  console.log(req.query.search);
  let search=req.query.search;
  const searchItems= await Listing.find({$or: [
      { country: { $in: search } },
      { location: { $in: search } },
      {title:{$in:search}}
    ]})
  res.render("listings/search.ejs",{searchItems});
};
