const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql2");
const bcrypt=require("bcrypt");
const app = express();
const passport=require("passport");
const port=3001;
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get("/signup", function(req, res){
    res.render("signup");
})

app.post("/signup", function(req, res){
    const name = req.body.name;
    var user_name=name;
    const email = req.body.email;
    const mobile = req.body.mobile;
    var admin = (req.body.isAdmin=='on')?1:0;
    var isUseradmin = (req.body.isAdmin=='on')?1:0;
    var password = req.body.password;
    const saltRounds=bcrypt.genSalt(20);
});



app.get("/login", function(req, res){
    res.render("login");
})

app.post("/login", function(req, res){
    const email = req.body.email;
    const password = req.body.password;
    isUseradmin = (req.body.isAdmin=='on')?1:0;
    var flag;
    const chkquery = "SELECT * FROM user WHERE email=?";
    
    mysqlConnection.query(chkquery,[email], (err, chkres, fields) => {
        if (!err){
            if(chkres.length==1){
                bcrypt.compare(password,chkres[0].password, function(err, result) {
                    if(!err){
                        flag=true;
                    }
                    else{
                        flag=false;
                    }
                });
                if(!flag){
                    if(isUseradmin==chkres[0].admin){
                        user_id=chkres[0].user_id;
                        user_name=chkres[0].name;
                        req.flash("success","Login Successful!");
                        return res.redirect("/");
                    }else{
                        req.flash("error","Incorrect information entered");
                        return res.redirect("/login");
                    }
                }else{
                    req.flash("error","Wrong Password/Email");
                    return res.redirect("/login");
                }
                
            }else if(chkres.length==0){
                req.flash("error","No User Found! Please sign up first.");
                return  res.redirect("/login");
            }else{
                //res.send("Multiple users found");
                return res.redirect("/login");
            }
        }
            else
            console.log(err);
    });

});

//google oauth
 

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    // User.findById(id, function(err, user) {
      done(null, user);
    //});
  });

passport.use(new GoogleStrategy({
    clientID: 803725655716-t96ujacgp48hi6au67i8c0h5ais0vsak.apps.googleusercontent.com,
    clientSecret: CQSn7wZ2JXrqLaiOi9Xz4F_E,
    callbackURL: "http://localhost:3000/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {

        //to check the profile.id in ur databse if not then create it
       //User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, profile);
       //});
  }
));
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback',passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });


app.get("/logout",(req,res)=>{
    req.session=null;
    req.logOut();
    res.redirect("/login");
});


  app.listen(port, function() {
    console.log("Server started on port 3000");
  });
  
