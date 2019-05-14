const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const ejs        = require('ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

// Connect to Mongoose //////////////////////////////////////
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

// Create post schema //////////////////////////////////////

const articleSchema = new mongoose.Schema ({
    title: {type: String, required: "WTF??? ...where is the Title???....ASSHOLE!!!"},
    content: {type: String, required: "WTF??? ...where is the Content???....ASSHOLE!!!"}
  });
  
  // Create Mongoose model /////////////////////////////////////
  
  const Article = mongoose.model("Article", articleSchema);

  // Routes /////////////////////////////////////////////////////
// Request ALL articles ////////////////////////////////////////////////
  app.route("/articles")

  .get((req, res) => {

    Article.find((err, foundArticles) => {

      if (!err) {

          res.send(foundArticles);

      } else {

        res.send(err);
      }

    });

  })

  .post((req, res) => {

    const newArticle = new Article ({
      title: req.body.title,
      content: req.body.content
    });
  
    newArticle.save(err => {
  
      if (!err)  {
  
        res.send("Successfuly added the article.");
  
      } else {

        res.send(err);

      }});

  })

  .delete((req, res) => {
    
    Article.deleteMany( err => {

      if (!err) {

        res.send("All articles were deleted successfuly.");

      } else {

        res.send(err);
      }

    });

  });

  // Request a SPECIFIC article /////////////////////////////////////

  app.route("/articles/:requestedArticle")
  
  .get((req, res) => {

    let articleName = req.params.requestedArticle;

    Article.findOne({title: articleName}, (err, foundArticle) => {

      if (foundArticle) {

          res.send(foundArticle);

      } else {

        res.send("Sorry, I didn't find that article.");
      }

    });

  })
  
  .put((req, res) => {

    Article.update({title: req.params.requestedArticle},
      
      {
      title: req.body.title,
      content: req.body.content
      }, {overwrite: true}, err => {

        if (!err) {

          res.send("Successfuly updated article.")

        } else {

          res.send(err);
        }

      });

  })
  
  .patch((req, res) => {

    Article.update({title: req.params.requestedArticle},{$set: req.body}, err => {

        if (!err) {

          res.send("Successfuly updated the requested fields in the article.")

        } else {

          res.send(err);
        }

      });

  })
  
  .delete((req, res) => {

    Article.deleteOne({title: req.params.requestedArticle}, err => {

        if (!err) {

          res.send("Successfuly deleted the article.")

        } else {

          res.send(err);
        }

      });

  });

// Initialise server on port 3000
app.listen(3000, () => {console.log("Server started on port 3000");});