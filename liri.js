require("dotenv").config();
var term = require( 'terminal-kit' ).terminal ;
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var keys = require("./keys");
var logFileName = "./log.txt"

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
            processMovieData(response.data);
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                logger(error.response.data);
                logger(error.response.status);
                logger(error.response.headers);
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
function processMovieData(response) {
    logger("Title : " + response.Title);
    logger("Year : " + response.Year);
    logger("IMDB Rating : " + response.Ratings[0].Value);
    logger("Rotten Tomato Ratig : " + response.Ratings[1].Value);
    logger("Country : " + response.Country);
    logger("Language : " + response.Language);
    logger("Plot : " + response.Plot);
    logger("Actors : " + response.Actors);
}
function runDefault() {

}

function logger(dataToWrite, whereToWrite) {
    if (whereToWrite === 0) {
        console.log(dataToWrite);
    } else if (whereToWrite === 1) {
        writeToFile(dataToWrite, logFileName);
    } else {
        console.log(dataToWrite);
        writeToFile(dataToWrite, logFileName);
    }
}

function writeToFile(dataToWrite, fileName) {
    fs.appendFile(fileName, dataToWrite + "\n", function (error) {
        if (error) {
            throw error;
        }
    })
}