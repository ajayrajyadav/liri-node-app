require("dotenv").config();
var term = require('terminal-kit').terminal;
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var keys = require("./keys");
var moment = require("moment");
var logFileName = "./log.txt"
var randomTxtFile = "./random.txt"
var separator = "============================================================================";
var bandSeparator = "----------------------------------------------------------------------------";
const log = console.log;
var fileToWriteArray = [];


// var spotifyClient = new Spotify("./keys.js")
var spotifyClient = new Spotify(keys.spotify)

let command = process.argv.slice(2, 3).join("").trim();
let secondCommand = process.argv.slice(3).join(" ");

// console.log(command);
// console.log(secondCommand);

main(command, secondCommand);

function main(command, secondCommand) {
    switch (command) {
        case "spotify-this-song":
        secondCommand = secondCommand === "" ? secondCommand = "The Sign Ace of Base" : secondCommand;
            doSpotifyThings(secondCommand);
            break;
        case "movie-this":
            secondCommand = secondCommand === "" ? secondCommand = "Mr. Nobody" : secondCommand;
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
    writeToFile(fileToWriteArray, logFileName);
}
//this function is for "do-what-it-says"
function doWhatItSays(secondCommand) {
    fs.readFile(randomTxtFile, "utf8", function (error, response) {
        if (error) {
            log("Error", error.message);
            // throw error;
        } else {
            let commands = response.split("\n");
            commands.forEach(elem => {
                let params = elem.split(",")
                main(params[0].trim(), params[1].trim());
            });

        }
    })
}

//this function is for "spotify-this"
function doSpotifyThings(secondCommand) {

    spotifyClient
        .search({ type: "track", query: secondCommand })
        .then(function (response) {
            // log(response);
            processSpotifyData(response)
        })
        .catch(function (err) {
            log(err);
        })
}
function processSpotifyData(data) {
    if (data.tracks.items.length > 0) {
        logger("", separator);
        logger("Artist(s) : ", data.tracks.items[0].album.artists[0].name);
        logger("The Song Name : ", data.tracks.items[0].name);
        logger("Album Name: ", data.tracks.items[0].album.name)
        if (data.tracks.items[0].preview_url === "null") {
            logger("^yPreview link is not available fro spotify");
        } else {
            logger("Preview Link : ", data.tracks.items[0].preview_url);
        }
        logger("", separator);
    }
}

//this function is for "concert-this"
function doBandThings(secondCommand) {
    // Querying the bandsintown api for the selected artist, the ?app_id parameter is required, but can equal anything
    var queryURL = "https://rest.bandsintown.com/artists/" + secondCommand + "/events?app_id=codingbootcamp";
    axios
        .get(queryURL)
        .then(function (response) {
            processBandData(response.data);
        })
        .catch(function (error) {
            if (error.response) {
                logger(error.response.data);
                logger(error.response.status);
                logger(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}
function processBandData(response) {
    response.forEach(element => {
        logger("", bandSeparator)
        logger("Venue : ", element.venue.name);
        logger("Location: ", element.venue.city + ", " + element.venue.region + ", " + element.venue.country)
        logger("Date of the Event: ", moment(element.datetime).format("dddd, MMMM Do YYYY, h:mm:ss a"))
    });
}

//this function is for "movie-this"
function doMovieThings(secondCommand) {
    var movieURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + secondCommand;
    axios
        .get(movieURL)
        .then(function (response) {
            processMovieData(response.data);
        })
        .catch(function (error) {
            if (error.response) {
                logger(error.response.data);
                logger(error.response.status);
                logger(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}
function processMovieData(response) {
    logger("", separator);
    logger("Title : ", response.Title);
    logger("Year : ", response.Year);
    logger("IMDB Rating : ", response.Ratings[0].Value);
    logger("Rotten Tomato Ratig : ", response.Ratings[1].Value);
    logger("Country : ", response.Country);
    logger("Language : ", response.Language);
    logger("Plot : ", response.Plot);
    logger("Actors : ", response.Actors);
    logger("", separator);
}

//this function either prints to screen or writes to file or do both
function logger(prefix, dataToWrite, whereToWrite) {
    if (whereToWrite === 0) {
        term("^g" + prefix + "^b^+" + dataToWrite + "\n")
    } else if (whereToWrite === 1) {
        // fileToWriteArray.push(prefix + dataToWrite + "\n")
        writeToFile(prefix + dataToWrite + "\n", logFileName);
    } else {
        term("^g" + prefix + "^b^+" + dataToWrite + "\n")
        // fileToWriteArray.push(prefix + dataToWrite + "\n")
        writeToFile(prefix + dataToWrite + "\n", logFileName);
    }
}

//this function writes a passed string to the passed file
function writeToFile(dataToWrite, fileName) {
    fs.appendFile(fileName, dataToWrite, function (error) {
        if (error) {
            throw error;
        }
    })
}