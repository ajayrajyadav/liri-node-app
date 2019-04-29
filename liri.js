require("dotenv").config();
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");
var keys = require("./keys");

// var spotify = new Spotify("./keys.js")

let command = process.argv.slice(2, 3).join("").trim();
let secondCommand = process.argv.slice(3).join(" ");

console.log(command);
console.log(secondCommand);