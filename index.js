var express = require("express");//import express
var app = express();//create an app
//require the body parser package
var bodyParser = require("body-parser");


//tells the app to uss the css file to something you can look at
app.use(express.static("public"));
//tell the app to use the body parser to turn in jsons
app.use(bodyParser.urlencoded({extended:true}));
//set the view engine so we can use ejs
app.set('view engine', 'ejs');

//start the app listening on a port and do a function
app.listen(process.env.PORT, function()
{
    console.log("server active");
});

//looks for url matching the string and does the function
// looks for a /
app.get("/", function(req,res){
    res.render("home.ejs")
});

//login routes
app.get("/login", function(req, res){
   res.render("login.ejs"); 
});

app.post("/login", function(req, res){
    
});

//register routes
app.get("/register", function(req, res){
   res.render("login.ejs"); 
});

app.post("/register", function(req, res){
    
});

// regex star takes everything this should be last so that other options are hit first
app.get("*", function(req, res){
    res.render("error.ejs");
});