require("dotenv").config();
var term = require( 'terminal-kit' ).terminal ;
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var keys = require("./keys");
var logFileName = "./log.txt"
var separator =
  "^g============================================================================^\n";

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

function doSpotifyThings(secondCommand){
    spotifyClient.search({type: "track", query: secondCommand}, function(
        err,
        data
    ){
        if(err){
            logger("^rError Occured: ^+" + err + "\n");
            return;
        }else if(data.tracks.items.length >0){
            logger(separator, 0);
            logger("^gArtist(s) : ^b^+" + data.tracks.items[0].album.artists[0].name +"\n");
            logger("^gThe Song Name : ^b^+" + data.tracks.items[0].name +"\n");
            logger("^gAlbum Name: ^b^+"+ data.tracks.items[0].album.name +"\n")
            if(data.tracks.items[0].preview_url === "null"){
                logger("^yPreview link is not available fro spotify");
            }else{
                logger("^gPreview Link : ^b^+" + data.tracks.items[0].preview_url + "\n");
            }
            logger(separator, 0);
        }
    })

}

function doBandThings(secondCommand){
    
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
    logger(separator, 0);
    logger("^gTitle : ^m^+"+ response.Title + "\n", 0);
    logger("^gYear : ^b^+" + response.Year + "\n", 0);
    logger("^gIMDB Rating : ^b^+" + response.Ratings[0].Value + "\n", 0);
    logger("^gRotten Tomato Ratig : ^b^+" + response.Ratings[1].Value + "\n", 0);
    logger("^gCountry : ^b^+" + response.Country + "\n", 0);
    logger("^gLanguage : ^b^+" + response.Language + "\n", 0);
    logger("^gPlot : ^b^+" + response.Plot + "\n", 0);
    logger("^gActors : ^b^+" + response.Actors + "\n", 0);
    logger(separator,0);
}
function runDefault() {

}

function logger(dataToWrite, whereToWrite) {
    if (whereToWrite === 0) {
        term(dataToWrite)
    } else if (whereToWrite === 1) {
        writeToFile(dataToWrite, logFileName);
    } else {
        term(dataToWrite)
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