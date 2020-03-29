//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});
//new mongoose.Schema einai gia thn mongoseencryption
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
//einai default apoto documendation ThisIsOurLittleSecret txaio onoma encryptedFields epilegw to password
//an thelw na kryptografisw kai alla pedia encryptedFields: ["password", "email"]
const secret = "ThisIsOurLittleSecret.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"]});


const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
 //apothikeyse ton neo user kai emafnise (render)thn secrets page
 newUser.save(function(err){
   if(!err){
     res.render("secrets");
   }else{
     console.log(err);
   }
 });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;
  //psakse an uparei to email pou egrapse o user an den uparxei err alliws koita kai to password
  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      //an uparxei user me auto to email pou egrapsa epano tsekare to password
      if(foundUser){
        //to ptwto pass einai tis bashs to deuetero auto pou egrapse o xrhsths
        if(foundUser.password = password){
          res.render("secrets");
        }
      }
    }
  });
});


app.listen(3000, function(){
  console.log("Server is running at Port 3000!.");
});
