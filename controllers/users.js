const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async (req,res)=>{
    try{
    let{username,email,password}=req.body;
    const neweUser=new User({email,username});
    const registerUser=await User.register(neweUser,password);
    req.login(registerUser,(err)=>{
        if(err)
        {
           return next(err);
        }
        req.flash("success","User Was registered");
        res.redirect("/listings");
    });
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome to Back !!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logOut=(req,res,next)=>{
    req.logout((err)=>{
        if(err)
        {
           return next(err);
        }
        req.flash("success","You are Log out!!");
        res.redirect("/listings");
    });
};