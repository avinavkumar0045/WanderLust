const Listing = require("../models/listing");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken = process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding ({ accessToken: mapToken });
// const fetch = require("node-fetch"); // <-- Add this
const mapTilerToken = process.env.MAP_TOKEN;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));





module.exports.index = async (req , res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
 
};

module.exports.renderNewForm = (req ,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res)=>{
    let{ id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
       path : "reviews",
       populate : {
           path : "author",
       },
    })
    .populate("owner"); // using populate method to get the reviews data and owner data along with the id 
    if (!listing) {
       req.flash("error", "Listing does not exist !");
       return res.redirect("/listings");   
    }
    console.log(listing);
    res.render("listings/show.ejs" , { listing } );
};

module.exports.createListing =  async (req , res , next)=>{
    // const query = "New Delhi, India"; // You can replace with req.body.location
    // const maptilerToken = process.env.MAP_TOKEN;

    // try {
    //     const response = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${maptilerToken}`);
    //     const data = await response.json();

    //     const coordinates = data.features[0]?.geometry?.coordinates;
    //     if (!coordinates) throw new Error("No coordinates found");

    //     console.log("Coordinates:", coordinates);

    //     res.send(`Coordinates: ${coordinates[1]}, ${coordinates[0]}`); // lat, long
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).send("Error fetching geolocation data");
    // }

    // let url = req.file.path; // reqd for the image 
    // let filename  = req.file.filename;
    // const newListing  = new Listing(req.body.listing); 
    // // while calling from hopscotch    
    // newListing.owner = req.user._id;
    // newListing.image = {url , filename}; 
    // await newListing.save();
    // req.flash("success", "New Listing created"),
   // res.redirect("/listings");
   const query = req.body.listing.location; // Use the location provided by user
    const maptilerToken = process.env.MAP_TOKEN;

    try {
        // Fetch coordinates from MapTiler
        const response = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${maptilerToken}`);
        const data = await response.json();

        const coordinates = data.features[0]?.geometry?.coordinates;
        if (!coordinates) throw new Error("No coordinates found");
        console.log("Coordinates : ",coordinates);

        // Prepare image data
        const url = req.file?.path;
        const filename = req.file?.filename;

        // Create new listing
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        newListing.geometry = {
            type: "Point",
            coordinates: coordinates, // [longitude, latitude]
        };

        let savedListing  = await newListing.save();
        console.log(savedListing);

        req.flash("success", "New Listing created");
        res.redirect(`/listings/${newListing._id}`);
    } catch (err) {
        console.error("Error creating listing:", err.message);
        req.flash("error", "Failed to create listing");
        res.redirect("/listings");
    }
};

module.exports.renderEditForm = async (req,res)=>{
    let{ id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist !");
        return res.redirect("/listings");   
     }

    let OriginalImageUrl = listing.image.url;
    OriginalImageUrl = OriginalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs" , {listing , OriginalImageUrl});
};

module.exports.updateListing = async(req, res)=>{
    let {id} = req.params;
    let listing =  await Listing.findByIdAndUpdate(id , {... req.body.listing})
    
    if( typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect (`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let DeletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted !");
    res.redirect("/listings");
};
