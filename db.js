const mongoose = require("mongoose"); //Using mongoose
const mongoDbUrl = process.env.DATABASE_URL;

//Setting up the strictQuery to true
mongoose.set("strictQuery", true);

//Using connectToMongo function to connect to the mongo database
const connectToMongo = () => {
  mongoose
    .connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`Connected to the database server: ${mongoDbUrl}`))
    .catch(() => console.log("No connection"));
};

//exporting connectToMongo function to the index.js (express)
module.exports = connectToMongo;
