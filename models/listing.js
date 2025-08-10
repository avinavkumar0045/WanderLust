const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema  = new Schema ({
    title :{
        type : String, 
        required : true,
    },
    description : String,
    image : { 
       url : String,
       filename :String,
    }, 
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectID,
            ref: "Review" //  this is the model we created in the review.js
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },

   geometry : {
    
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
   },
//    category : {
//       type : String,
//       enum:["mountain","farm","iconic site","castles","pool","camping","room","arctic" ]
//    }
  
});

listingSchema.post("findOneAndDelete", async (listing) =>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}}); // to delete the reviews related to a particular listing , when that listing is deleted
    }
    

})

const Listing  = mongoose.model("Listing", listingSchema); // yeha pe error kyu aa raha hai
module.exports  = Listing;  // exporting this module to app.js " module.exports "
