const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql2");
const bcrypt=require("bcrypt");
const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const con= mysql.createConnection(
    {
        host: 'localhost',
        user:'root',
        password:'',
        database:'user'
    }
)
con.connect(function(err){
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log('Connected to MySQL!');
    }
})

app.get("/signup", function(req, res){
    res.render("signup");
})

app.post("/signup", function(req, res){
    const name = req.body.name;
    user_name=name;
    const email = req.body.email;
    const mobile = req.body.mobile;
    var admin = (req.body.isAdmin=='on')?1:0;
    isUseradmin = (req.body.isAdmin=='on')?1:0;
    var password = req.body.password;
    const saltRounds=bcrypt.genSalt(20);
    con.query("insert into user_data values(?,?,?,?,?)",[user_name,email,mobile,admin,password],(err,rows)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.send("Data added successfully!");
        }
    });
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
    
    con.query(chkquery,[email], (err, chkres, fields) => {
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

})

app.listen(3000,()=>{
    console.log(`Listening to the port: 3000`);
})
