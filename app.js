//required packages
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

//counter for daily limit
var counter = 50;

//create the express server
const app = express();

var favicon = require("serve-favicon");
app.use(favicon(__dirname + "/outputDir/favicon.ico"));

//server port number
const PORT = process.env.PORT || 3000;

//set template engine
app.set("view engine", "ejs");
app.use(express.static("public"));

//needed to parse html data for POST request
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.get("/", (req, res) => {
  res.render("index");
});
app.post("/convert-mp3", async (req, res) => {
  const videoID = req.body.videoID;

  //cutting full url to id
  var id = "";
  if (videoID.includes("https://www.youtube.com/watch?v=")) {
    var id = videoID.replace("https://www.youtube.com/watch?v=", "");
  } else if (videoID.includes("https://youtu.be/")) {
    var id = videoID.replace("https://youtu.be/", "");
  } else if (videoID.includes("https://m.youtube.com/watch?v=")) {
    var id = videoID.replace("https://m.youtube.com/watch?v=", "");
  }

  if (id === undefined || id === "" || id === null) {
    return res.render("index", { success: false, message: "Please enter a video ID" });
  } else {
    const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${id}`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.API_KEY,
        "x-rapidapi-host": process.env.API_HOST,
      },
    });
    const fetchResponse = await fetchAPI.json();
    if (fetchResponse.status === "ok")
      return res.render("index", { success: true, song_title: fetchResponse.title, song_link: fetchResponse.link });
    else return res.render("index", { success: false, message: fetchResponse.msg });
  }
});

//start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
