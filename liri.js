require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var request = require('request');

var fs = require("fs");
var nodeArgs = process.argv;
var command = process.argv[2];
var userInput = [];

for (var v = 3; v < nodeArgs.length; v++) {
	userInput.push(nodeArgs[v])
}


function myTweets() {
	var params = {screen_name: 'Mets'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		for (var i = 0; i < 20; i++) {	
			if (!error) {
			console.log(tweets[i].text);
			console.log(tweets[i].created_at);
			};
		};
	});
};

function spotifyThis() {
	var song = "";
	for (var i = 0; i < userInput.length; i++) {
		song = song + " " + userInput[i];
	}
	if (song === "") {
		song = "ace of base";
	}
	spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}
		console.log(data.tracks.items[0].artists[0].name)
		console.log(data.tracks.items[0].name);
		console.log(data.tracks.items[0].preview_url);
		console.log(data.tracks.items[0].album.name); 
	});
};

function getMovie() {
	var movie = "";
	for (var m = 0; m < userInput.length; m++) {
		movie = movie + "+" + userInput[m]
	}
	if (movie === "") {
		movie = "Mr+Nobody";
	}
	console.log(movie)
	request('http://www.omdbapi.com/?t=' + movie + '&plot=short&apikey=trilogy', function (error, response, body) {
		var bodyParse = JSON.parse(body);
		console.log('Title: ' + bodyParse.Title);
		console.log('Year: ' + bodyParse.Year);
		console.log('Rated: ' + bodyParse.Rated);
		console.log('IMDB Rating: ' + bodyParse.imdbRating);
		console.log('Country: ' + bodyParse.Country);
		console.log('Language: ' + bodyParse.Language);
		console.log('Plot: ' + bodyParse.Plost);
		console.log('Actors: ' + bodyParse.Actors);
		console.log('Rotten Tomatoes Rating: ' + bodyParse.tomatoRating);
		console.log('Rotten Tomates URL: ' + bodyParse.tomatoURL);
	});
};

function doWhat() {
	fs.readFile('random.txt', 'utf8', function(err, data)	{
		if (err) {
			return console.log('Error occurred: ' + err);
		}
		var dataArr = data.split(',');
		command = dataArr[0];
		for (var q = 1; q < dataArr.length; q++) {
			userInput.push(dataArr[q]);
		}
		userChoice(command);
		
	})
}

var userChoice = function(userInput) {
	switch(command) {
		case "my-tweets":
			myTweets();
			break;
		case "spotify-this-song":
			spotifyThis(userInput);
			break;
		case "movie-this":
			getMovie();
			break;
		case "do-what-it-says":
			doWhat();
			break;
		default:
			console.log("Command not recognized")
	}
}

userChoice()