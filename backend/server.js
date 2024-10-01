const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { getData } = require("./Connection");

const app = express();
//dotenv configuration
dotenv.config();

//middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//API
app.get("/products", getData);

const hostname = "127.0.0.1";
const PORT = process.env.PORT || 8080;

//Listen
app.listen(PORT, hostname, () => {
  console.log(`server running at http://${hostname}:${PORT}`);
});
