const express = require('express');
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000
const path = require('path');
const session = require('express-session');
const { v4: uuidv4 } = require("uuid");
const nocache = require('nocache');
const morgan = require("morgan");

const dbConnect = require('./config/dbConnect')
dbConnect()

const userRoute = require('./routes/authRoute')
const adminRoute = require('./routes/adminRoute')

app.use(nocache());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));  
app.use(express.urlencoded({ extended: false }));   


//session
app.use(
    session({
      secret: uuidv4(),
      resave: false,
      saveUninitialized: true,
    })
  );
  app.use(morgan("tiny"));

app.use('/',userRoute)
app.use('/',adminRoute)



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("user/error");
});



app.listen(PORT,()=>{
    console.log(`server started at PORT ${PORT}`);

})
