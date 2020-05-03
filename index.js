var express = require("express");//import express
var bodyParser = require("body-parser");//require the body parser package
var mysql = require("mysql");//require my sql
var bcrypt = require("bcrypt")//require bcrypt
var session = require('express-session');//require sessions
var app = express();//create an app
app.use(express.static("public"));//public folder can be staticly referenced
app.use(bodyParser.urlencoded({extended:true}));//tell the app to use the body parser to turn in jsons
app.use(session({
    secret:"this is the secret key",
    resave: true,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');//set the view engine so we can use ejs

//create sql server 
const connection = mysql.createConnection({
    host:"localhost",
    user: "enyaw",
    password: "0215Enyaw!",
    database: "server_db"
})
connection.connect();

function checkUsername(username){
  let stmt = "SELECT * FROM users WHERE username =?";
  return new Promise(function(resolve, reject){
      connection.query(stmt, [username], function(error, results) {
            if(error) throw error;
            resolve(results);
      });
  });
};

function checkPassword(password, hashedPassword )
{
    return new Promise(function(resolve, reject){
       bcrypt.compare(password, hashedPassword, function(error, result){
           if(error) throw error;
           resolve(result);
       }); 
    });
}

function isAuthenticated(req, res, next)
{
    if(!req.session.authenticated) res.redirect('/login');
    else next();
}

function buildSessionData(req){
    if(typeof req.session.authenticated == 'undefined')
    {
        return {authenticated: false}
    }
    else
    {
        return {user: req.session.user, authenticated: req.session.authenticated}
    }
}

//start the app listening on a port and do a function
app.listen(process.env.PORT, function()
{
    console.log("server active");
});

//looks for url matching the string and does the function
// looks for a /
app.get("/", function(req,res){
    res.render("home.ejs", {session: buildSessionData(req)})
});

app.get('/welcome', isAuthenticated, async function(req, res) {
    res.render('welcome.ejs', {session: await buildSessionData(req)});
});

//login routes
app.get("/login", function(req, res){
   res.render("login.ejs"); 
});

app.post("/login", async function(req, res){
    let users = await checkUsername(req.body.username);
    
    let hashedPassword = users.length > 0 ? users[0].password : '';
    let passwordMatch = await checkPassword(req.body.password, hashedPassword);
    if(passwordMatch){
        req.session.authenticated = true;
        req.session.user = users[0].username;
        res.redirect('/welcome');
    }
    else{
        res.render('login.ejs', {error: true})
    }
});

app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

//register routes
app.get("/register", function(req, res){
   res.render("register.ejs"); 
});

app.post("/register", function(req, res){
    let salt = 15;
    bcrypt.hash(req.body.password, salt, function(error, hash){
        if(error) throw error;
        var stmt = 'INSERT INTO users (username, password) VALUES (?,?);';
        var data = [req.body.username, hash];
        connection.query(stmt, data, function(error,result){
            if(error) throw error;
            res.redirect('/login');
        });
    });
});

// regex star takes everything this should be last so that other options are hit first
app.get("*", function(req, res){
    res.render("error.ejs");
});