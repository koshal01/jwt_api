const express = require("express");
require("dotenv").config();
const app = express();
const fileUpload = require("express-fileupload"); 

//regular middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//cookie and file middleware
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

//import all routes here
const user = require('./routes/user');

//router middleware
app.use("/api/v1", user);

module.exports = app;