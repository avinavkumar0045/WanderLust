const Listing = require("../models/listing");
const Review = require("../models/review");
const User  = require("../models/user");
module.exports.renderSignupForm = (req , res)=>{
    res.render("users/signup.ejs");
};


module.exports.signup = async(req ,res)=>{
    try{
        let{username , email , password} = req.body;
        const newUser = new User ({email , username});
        const registeredUser = await  User.register(newUser ,password);
        console.log(registeredUser);
        req.login(registeredUser ,(err)=>{ // to Directly login , when signUp , nahi to fir se login krna hoga
            if(err){
                return next(err);
            }
            req.flash("success", "Namaste , Welcome to WanderLust 🙏🏼");
            res.redirect("/listings");
        } );
    } catch(e){
           req.flash("error", e.message);
           res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req ,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req ,res)=>{ // middleware passport will authenticate the user 
    req.flash("success","Welcome back  to WanderLust !");
    let redirectUrl = res.locals.redirectUrl || "/listings"; 
     res.redirect(redirectUrl); // matlab waha redirct krna jana ctually jana tha , wapis listings se hoke naa jana pade 
};

module.exports.logout = (req , res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    })
};