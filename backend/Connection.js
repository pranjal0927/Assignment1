const axios = require("axios");
const dotenv = require("dotenv");

//dot config
dotenv.config();

const URL = process.env.URL;

const getData = async (req, res) => {
  try {
    const response = await axios.get(URL);
    res.json(response.data);
    res.status(200).send("data fetch successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "failed to fetch the data " });
  }
};

module.exports = { getData };
