var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer");

//app config
mongoose.connect("mongodb://localhost/restfull_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//mongoose model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);


//RESTful Routes
app.get("/", function(req,res){
    res.redirect("/blogs");
});

//INDEX 
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("error")
        } else{
            res.render("index", {blogs:blogs});
        }
    });
});

//NEW
app.get("/blogs/new", function(req,res){
    res.render("new");
})

//CREATE
app.post("/blogs", function(req,res){
    //create blog
    //sanitize data
    req.body.blog.body = req.sanitizer(req.body.blog.body);
    Blog.create(req.body.blog, function(err,newBlog){
        if(err){
            res.render("new");
        } else{
            //redirect to index
            res.redirect("/blogs");
        }
    });
});

//SHOW
app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
            //res.redirect("/blogs");
        } else{
            res.render("show", {blog:foundBlog});
        }
    })
});


//EDIT
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("edit", {blog:foundBlog});
        }
    })
});


//UPDATE
app.put("/blogs/:id", function(req, res){
    
    //sanitize data
    req.body.blog.body = req.sanitizer(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/"+req.params.id);
        }
    })
});


//DELETE
app.delete("/blogs/:id", function(req, res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else{
            //redirect
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});