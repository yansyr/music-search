import axios from "axios";
import bodyParser from "body-parser";
import express from "express";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/submit", async (req, res) => {
    const artist = req.body["artist"];
    const title = req.body["title"];

    if (artist.trim() === "") {
        res.render("index.ejs", {content: "Enter a artist"});
        return;
    }

    if (title.trim() === "") {
        res.render("index.ejs", {content: "Enter the title"});
        return;
    }

    try {
        const response = await axios.get(`https://api.lyrics.ovh/v1/${artist}/${title}`)
        const result = response.data;
        const lyrics = result["lyrics"]
        
        const lyrics_br = lyrics.replaceAll("\n", "<br>")
        res.render("index.ejs", {content: lyrics_br, artist: artist, title: title});

    } catch (error) {
        res.render("index.ejs", {content: "Lyric not found"});
        console.log(error.message)
    }
   
});

app.listen(port, () => {
    console.log(`Server is running on: ${port}`)
});