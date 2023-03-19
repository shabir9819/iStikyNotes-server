const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

//Using express.json to convert into json
app.use(express.json());

//Using dotenv to convert env
dotenv.config();

const JWT_SECRET_KEY = process.env.DATABASE_JWT_SECRET; //JWT_SECRET_KEY


//importing connectToMongo function 
const connectToMongo = require("./db");
connectToMongo();

//Adding cors and using it
var corsOptions = {
    origin: '*',
    credentials: true };
app.use(cors(corsOptions));

// using 5500 port for express
const port = process.env.PORT || process.env.SITE_PORT;

//Using router for accesing
app.get("*", async(req, res)=>{
    res.send("Working...")
})
app.use("/api/auth",require("./routers/auths"));
app.use("/api/notes",require("./routers/notes"));
app.use("/api/message", require("./routers/messages"));


app.listen(port, ()=> console.log(`Connected successfully to port : http://localhost: ${port}`));
