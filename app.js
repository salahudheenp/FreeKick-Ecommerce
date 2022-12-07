var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var Handlebars = require('handlebars');
var bodyParser=require('body-parser')
require('dotenv').config();


var userRouter = require("./routes/user");
var adminRouter = require("./routes/admin");
var hbs = require("express-handlebars");

Handlebars.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});

Handlebars.registerHelper('ifCheck', function (arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
})  



var app = express();
// var fileupload = require("express-fileupload");
var db = require("./config/connection");
const { doesNotMatch } = require("assert");
const productHelpers = require("./helpers/product-helpers");
var session=require("express-session")

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layout",
    partialsDir: __dirname + "/views/partials",
  })
);

//clear cache
app.use((req, res, next) => {
  res.set('Cache-Control',
    `no-cache, private,no-store,must-revalidate,max-stale=0,pre-check=0`)
  next();
})


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(fileupload());
app.use(session({secret:"key",cookie:{maxAge:6000000000000}}))




db.connect((err) => {
  if (err) console.log("connection err");
  else console.log("db connected");
});

app.use("/user", userRouter);
app.use("/admin", adminRouter);

 app.get("/", (req, res) => {
   if (req.session.loggedIn){
    console.log("============================================================================");
     res.redirect("/user")
   }else{
     productHelpers.getAllProducts().then((product) => {
       console.log("============================================================================",product);

       res.render("index", {  product });
     })
   }
 
 });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("user/404", { login :true});
});

module.exports = app;
