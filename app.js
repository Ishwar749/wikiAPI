const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true});

const articleSchema = {
  title : String,
  content : String
};
const Article = mongoose.model("Article",articleSchema);

/////////////////////////////// REQUEST TARGETING ALL ARTICLES ///////////////////////////////////

app.route("/articles")

.get(function(req,res){
  Article.find(function(err,foundArticles){
    if(err){
      res.send(err);
    }
    else{
      res.send(foundArticles);
    }
  });
})


.post(function(req,res){
  const newArticle = new Article({
    title : req.body.title,
    content : req.body.content
  });

  newArticle.save(function(err){
    if(err){
      res.end(err);
    }
    else{
      res.send("Successfully added a new article");
    }
  });
})


.delete(function(req,res){
  Article.deleteMany(function(err){
    if(err){
      res.send(err);
    }
    else{
      res.send("Successfully deleted all articles");
    }
  });
});


///////////////////////////////////// REQUEST TARGETING A SPECIFIC ARTICLE ////////////////////////////
app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({title: req.params.articleTitle}, function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }
    else{
      res.send("No articles matching that title was found.");
    }
  });
})

.put(function(req,res){
  Article.replaceOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(err){
        console.log(err);
        res.send("There was an error updating that article");
      }
      else{
        res.send("Successfully updated article");
      }
    }
  );
})

.patch(function(req,res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set : req.body},
    function(err){
      if(err){
        res.send("There was an error updating you selected article");
      }
      else{
        res.send("Successfully updated the selected article");
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(err){
        res.send("There was a problem deleting that article");
      }
      else{
        res.send("Successfully deleted the specified article");
      }
    }
  );
});

app.listen(3000,function(){
  console.log("Server started at port 3000");
});
