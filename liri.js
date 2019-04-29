require("dotenv").config();
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var keys = require("./keys");

// var spotify = new Spotify("./keys.js")

let command = process.argv.slice(2, 3).join("").trim();
let secondCommand = process.argv.slice(3).join(" ");

console.log(command);
console.log(secondCommand);

main(command, secondCommand);

function main(command, secondCommand) {
    switch (command) {
        case "spotify-this-song":
            doSpotifyThings(secondCommand);
            break;
        case "movie-this":
            doMovieThings(secondCommand);
            break;
        case "concert-this":
            doBandThings(secondCommand);
            break;
        case "do-what-it-says":
            doWhatItSays(secondCommand)
            break;
        default:
            runDefault();
            break;
    }
}

function doMovieThings(secondCommand) {
    var movieURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + secondCommand;

    axios
        .get(movieURL)
        .then(function (response) {
            // If the axios was successful...
            // Then log the body from the site!
            console.log(response.data);
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}

function runDefault() {

}