var express = require("express");//import express
var bodyParser = require("body-parser");//require the body parser package
var mysql = require("mysql");//require my sql
var bcrypt = require("bcrypt");//require bcrypt
var session = require('express-session');//require sessions
var request = require('request');//require request
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
});
connection.connect();

function checkUsername(username){
  let stmt = "SELECT * FROM users WHERE username =?";
  return new Promise(function(resolve, reject){
      connection.query(stmt, [username], function(error, results) {
            if(error) throw error;
            resolve(results);
      });
  });
}

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
        return {authenticated: false,isAdmin: false};
    }
    else
    {
        return {user: req.session.user, authenticated: req.session.authenticated, isAdmin : req.session.isAdmin};
    }
}

function buildBlogData(req,blogId){
  let stmt = "SELECT * FROM blog_posts WHERE blogId =?;";
  return new Promise(function(resolve, reject){
      connection.query(stmt, [blogId], function(error, results) {
            if(error) throw error;
            if(results.length == 0){ resolve({blogId:0});}
            else{ resolve(results[0])}
      });
  });
}

//returns the tags associated with a given blog id
function getTags(blogId)
{
    let stmt = "SELECT tagname FROM tag_to_blog WHERE blogId = ?;";
    return new Promise(function(resolve,reject){
        connection.query(stmt,[blogId],function(error, results) {
            if(error) throw error;
            resolve(results);
        });
    });
}

function getAllTags(){
    let stmt = "SELECT tagname FROM tags;";
    return new Promise(function(resolve, reject){
        connection.query(stmt, function(error, results) {
            if(error) throw error;
            resolve(results);
        });
    });
}

function buildSearchResults(req,search,catagory)
{
    //if search by tag
    if(catagory == "tag")
    {
        let stmt = "SELECT * FROM blog_posts WHERE blogId = ANY (SELECT blogId FROM tag_to_blog WHERE tag_to_blog.tagname = ?);";
        return new Promise(function(resolve, reject){
            connection.query(stmt,[search], function(error, results) {
                if(error) throw error;
                    resolve(results);
            });
        });
    }
    else{// if search by anything else
    let stmt = "SELECT * FROM blog_posts WHERE " + catagory + " = ?;";
    return new Promise(function(resolve, reject){
        connection.query(stmt,[search], function(error, results) {
            if(error) throw error;
            resolve(results);
        });
    });
        
    }
}

function createBlogPost(title,body,username,tagnames)
{
    
    let stmt = "INSERT INTO blog_posts (title,body,author_username) VALUES (?,?,?);";
    return new Promise(function(resolve, reject){
        connection.query(stmt,[title,body,username], function(error, results) {
            if(error) throw error;
            stmt = "INSERT INTO tag_to_blog (tagname,blogId) VALUES ?;";
            let values = [];
            for(let i = 0; i < tagnames.length; i++){
                values.push([tagnames[i],results.insertId]);
            }
            connection.query(stmt,[values],function(error, results1) {
                if(error) throw error;
                resolve({success: true, blogId:results.insertId});
            });
        });
    });
}

function deleteBlogPost(username,isAdmin,blogId)
{
    return new Promise(function(resolve,reject){
        if(!isAdmin){
            //check if the post can be deleted
            let stmt = "SELECT author_username FROM blog_posts WHERE blogId = ?;";
            connection.query(stmt,[blogId],function(error, results) {
                if(error)throw error;
                if(!(results[0].author_username == username))
                {
                    resolve({success:false});//should not be able to delete
                }
            });
        }
        let stmt = "DELETE FROM blog_posts WHERE blogId=?;";
        connection.query(stmt,[blogId],function(error, results) {
            if(error) throw error;
            resolve({success:true});
        });
    });
}

function editBlogPost(username,blogId,body)
{
    return new Promise(function(resolve,reject){
        //check if the post can be edited
        let stmt = "SELECT author_username FROM blog_posts WHERE blogId = ?;";
        connection.query(stmt,[blogId],function(error, results) {
            if(error)throw error;
            if(!(results[0].author_username == username))
            {
                resolve({success:false});//should not be able to edit
            }
        });
        //edit
        stmt = "UPDATE blog_posts SET body = ? WHERE blogId=?;";
        connection.query(stmt,[body, blogId],function(error, results) {
            if(error) throw error;
            resolve({success:true});
        });
    });
}


//start the app listening on a port and do a function
app.listen(process.env.PORT, function()
{
    console.log("server active");
});



//looks for url matching the string and does the function
// looks for a /
app.get("/", async function(req,res){
    res.render("home.ejs", {session: await  buildSessionData(req)});
});

app.get('/welcome', isAuthenticated, async function(req, res) {
    res.render('welcome.ejs', {session: await buildSessionData(req)});
});

app.post('/deletePost/:blogId', isAuthenticated, async function(req,res){
    let username = req.session.user;
    let isAdmin = req.session.isAdmin;
    let blogId = req.params.blogId;
    let result = deleteBlogPost(username,isAdmin,blogId);
    res.redirect('/');
    
});

//route for creating a new post requires user to be loged in
app.get('/userPost', isAuthenticated, async function(req, res) {
    res.render('userPost.ejs', {session: await buildSessionData(req), tags: await getAllTags()});
});

//route for creating a new post requires user to be loged in
app.post('/userPost', isAuthenticated, async function(req, res) {
    let title = req.body.title;
    let body = req.body.body;
    let tagnames = req.body.tagnames;
    let username = req.session.user;
    let result = await createBlogPost(title,body,username,tagnames);
    res.redirect('/blog/'+ result.blogId);
});

app.get('/editPost/:blogId', isAuthenticated, async function(req,res)
{
    let blogData = await buildBlogData(req, req.params.blogId);
    //test if the blog exits
    if(blogData.blogId == 0) {
        res.redirect("/error");
    }
    console.log(getTags(req.params.blogId));
    res.render('editPost.ejs', {session: await buildSessionData(req), blog: blogData,tags: await getTags(req.params.blogId)
    });
});

app.put('/editPost/:blogId', isAuthenticated, async function(req,res)
{
    let blogId = req.params.blogId;
    let blogData = await buildBlogData(req, blogId);
    //render the page with the id
    if(blogData.blogId == 0) {
        res.redirect("/error");
    }
    let results = await editBlogPost(req.session.user, blogId, req.body.body);
    if(!results.success) res.redirect('/error');
    res.redirect('/blog/'+blogId);
});

app.get('/search',async function(req, res) {
    res.render('search.ejs',{session:await buildSessionData(req)});
});

app.post('/search', async function(req,res){
    let search = req.body.search;
    let catagory = req.body.catagory;
    let results = await buildSearchResults(req, search, catagory);
    res.render('search.ejs',{session : await buildSessionData(req), results: results} );
});

app.get('/blog/:blogId',async function(req, res) {
    //get the blog based on the id
    let blogData = await buildBlogData(req, req.params.blogId);
    //render the page with the id
    if(blogData.blogId == 0) {
        res.redirect("/error");
    }
    else{
        res.render("blog.ejs",{session: await buildSessionData(req), blog : blogData, tags: await getTags(blogData.blogId)});
    }
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
        req.session.isAdmin = users[0].isAdmin;
        res.redirect('/welcome');
    }
    else{
        res.render('login.ejs', {error: true});
    }
});

//logout route
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

app.get('/jokes', async function(req,res){
    res.render("jokes.ejs",{session: await buildSessionData(req)});
});

app.post('/jokes', function(req, res) {
    request("https://official-joke-api.appspot.com/jokes/random",function(error,response,dataStream){
        if(!error && response.statusCode == 200){
            var json = JSON.parse(dataStream);
            res.json(json);
        }
    });
});

// regex star takes everything this should be last so that other options are hit first
app.get("*", function(req, res){
    res.render("error.ejs");
});