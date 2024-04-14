const express = require('express');
const router =  require("./routes/approutes.js");
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3001;
const errorHandler = require("./errorHandler.js")


const app = express();

app.use(function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    const allowedOrigins = '*';
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
    next();
  }); //avoid cross origin access errors
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use("", router);

app.use(errorHandler);


app.listen(port, () => console.log("server running on port ", port));
