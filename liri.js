require("dotenv").config();
var term = require( 'terminal-kit' ).terminal ;
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

function doWhatItSays(secondCommand){
    fs.readFile(randomTxtFile, "utf8", function(error, response){
        if(error){
            console.log("Error", error.message);
            // throw error;
        }else{
            let commands = response.split("\n");
            log(commands)
            commands.forEach(elem => {
                log("in here")
                let params = elem.split(",")
                main(params[0].trim(), params[1].trim());
                // console.log(params);
            });
            
        }
    })
}

function doSpotifyThings(secondCommand){
    spotifyClient.search({type: "track", query: secondCommand}, function(
        err,
        data
    ){
        if(err){
            logger("Error Occured: " + err);
            return;
        }else if(data.tracks.items.length >0){
            logger("",separator);
            logger("Artist(s) : " , data.tracks.items[0].album.artists[0].name);
            logger("The Song Name : " , data.tracks.items[0].name);
            logger("Album Name: " , data.tracks.items[0].album.name)
            if(data.tracks.items[0].preview_url === "null"){
                logger("^yPreview link is not available fro spotify");
            }else{
                logger("Preview Link : " , data.tracks.items[0].preview_url);
            }
            logger("", separator);
        }
    })

}

function doBandThings(secondCommand){

    // Querying the bandsintown api for the selected artist, the ?app_id parameter is required, but can equal anything
    var queryURL = "https://rest.bandsintown.com/artists/" + secondCommand + "/events?app_id=codingbootcamp";
    console.log(queryURL);
    
    axios
    .get(queryURL)
    .then(function (response) {
        // console.log(response.data[0].venue);
        processBandData(response.data);
        // processMovieData(response.data);
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
function processBandData(response){
    response.forEach(element => {
        logger("",bandSeparator)
        logger("Venue : " , element.venue.name);
        logger("Location: ", element.venue.city + ", "+ element.venue.region + ", " + element.venue.country)
        logger("Date of the Event: " , moment(element.datetime).format("dddd, MMMM Do YYYY, h:mm:ss a"))
    });    
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
    logger("Title : " , response.Title);
    logger("Year : " , response.Year);
    logger("IMDB Rating : " , response.Ratings[0].Value);
    logger("Rotten Tomato Ratig : " , response.Ratings[1].Value);
    logger("Country : " , response.Country);
    logger("Language : " , response.Language);
    logger("Plot : " , response.Plot);
    logger("Actors : " , response.Actors);
    logger(separator,0);
}
function runDefault() {

}

function logger(prefix, dataToWrite, whereToWrite) {
    if (whereToWrite === 0) {
        term("^g" + prefix + "^b^+" + dataToWrite + "\n")
    } else if (whereToWrite === 1) {
        writeToFile(prefix + dataToWrite + "\n", logFileName);
    } else {
        term("^g" + prefix + "^b^+" + dataToWrite + "\n")
        writeToFile(prefix + dataToWrite + "\n", logFileName);
    }
}

function writeToFile(dataToWrite, fileName) {
    fs.appendFile(fileName, dataToWrite, function (error) {
        if (error) {
            throw error;
        }
    })
}