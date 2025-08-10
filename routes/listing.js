// this is routes js where we are storing all the routes with listing , so that the app.js dont become bloted

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing  = require("../models/listing.js"); 
const {isLoggedIn , isOwner, validateListing} = require("../middleware.js"); // middleware made to check if logged in or not 
const listingController = require("../controllers/listings.js");
const multer = require("multer");  // so multer will take the file data from the new form and store them into uploads 
const { storage } = require("../CloudConfig.js"); // ✅ CORRECT WAY
const upload = multer({ storage });// here we have changed the data storage location from uploads to storage in cloudinary


router
    .route("/")
    //Index route 
    .get(wrapAsync(listingController.index))// baaking is controllers . js 
    //create route 
    .post(isLoggedIn,
        upload.single('listing[image]'),
        validateListing , 
        wrapAsync(listingController.createListing)
    )
    
// New Route // 🌟🌟🌟 New route above show route
router.get("/new",isLoggedIn , listingController.renderNewForm);

router 
    .route("/:id")
    //new route
    .get( wrapAsync(listingController.showListing))
    // update route 
    .put(isLoggedIn , 
        isOwner,
        upload.single('listing[image]'),
    validateListing, // for validating the listing 
    wrapAsync( listingController.updateListing)
    )
    // delete route 
    .delete(isLoggedIn,isOwner, wrapAsync (listingController.destroyListing));
    
    // New Route // 🌟🌟🌟 New route above show route
    router.get("/new",isLoggedIn , listingController.renderNewForm

    );
 
// Edit route
router.get("/:id/edit",isLoggedIn ,isOwner, wrapAsync( listingController.renderEditForm));

module.exports = router ; 
