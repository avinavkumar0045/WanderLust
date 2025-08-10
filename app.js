if(process.env.NODE_ENV != "production"){ // we are using .env file cause we are not in production phase. when this website in production, then we will not give access to .env file
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose  = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Listing  = require("./models/listing.js"); 
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//sudo brew services start mongodb-community@8.0
// ==> mongosh

// address 
const listingRouter = require("./routes/listing.js");// for the different routes in the same file
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL =  "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL; // from mongo db database online 

main() 
.then (() =>{
    console.log("connected to DB") ;
}).catch( err =>{
    console.log(err);
});

async function main(){
    console.log("Connecting to DB at:", dbUrl);
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}) );
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate); // for the ejs mate
app.use(express.static(path.join(__dirname , "/public")));

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto :{
     secret : process.env.SECRET,
    },
    touchAfter : 24 * 60 * 60, // to be stored in seconds {if there is no change in the session, then it will not be updated for 24 hours}
 });

 store.on ("error", ()=>{
    console.log("ERRON IN MONGO SESSION", err)
 })

const sessionOptions = {
    store ,
    secret : process.env.SECRET,
    resave : "false",
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // we write the date in milli seconds of the cookie to expire
        maxage: 7 * 24 * 60 * 60 * 1000 ,
        httpOnly :true, // by default saved to true
      
    },
};

// basic api :
// app.get("/" , (req,res)=>{
//     res.send("Hi I am Avinav Kumar");
// })




app.use(session(sessionOptions)); // for the session of the cookiee
app.use(flash()); // for the flash session addition // flash to be writtem before the routes

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req , res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error"); // when the searched listng does not exist
    res.locals.currUser = req.user ; // this is stored to be used in navbar.ejs 
    next(); // of not then we will struck on samep page

})

// // login method 
// app.get("/demouser", async(req , res)=>{
//     let fakeUser  = new User ({ // creating fakeuser 
//         email : "student@gmail.com",
//         username : "delta-student",
//     });
//    let registerdUser =  await User.register(fakeUser , "helloworld") ;  // registering fakeuser 
//    res.send(registerdUser);
// })
// refer flash.ejs 
app.use("/listings", listingRouter); // it means where ever /lisitngs will come we will use our lisitngs 
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// app.get("/testListing", async (req,res)=>{  // 🌟🌟🌟 commented out to so that multiple data is not inserted
//     let sampleListing = new Listing({
//         title : "My Home",
//         description : "By the beach",
//         price : 1200,
//         location : "Rohtas Fort , Bihar",
//         country : "India",
//     });
//    await  sampleListing.save();
//    console.log("Sample was saved");
//    res.end("Successfull testing");

// });

// app.all("*",(req , res , next)=>{ // yeha issue hai 
//     next (new ExpressError(404 , "Page not found!"));

//  });

app.use((err , req , res ,next )=>{ // custom error handling 
    let {statusCode = 500 ,message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
   // res.status(statusCode).send(message);  
});

// this is just to make the connection
app.listen(8080 , () => {
    console.log("Server is listining to port 8080");
});

