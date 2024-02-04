const express = require('express');
const router =  require("./routes/approutes.js");
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3001;
const userRouter = require("./routes/users/users.js")
const errorHandler = require("./errorHandler.js")


const app = express();

app.use(cors()); //avoid cross origin access errors
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use("/old", userRouter);
app.use("/users", router);

app.use(errorHandler);


app.listen(port, () => console.log("server running on port ", port));
