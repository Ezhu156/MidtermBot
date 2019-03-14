console.log("Hello!!! It's starting!");
var Twit = require('twit');
var config = require('./config.js');
var T = new Twit(config);

const yelp = require('yelp-fusion');
var config2 = require('./config2.js');
const client = yelp.client(config2);

'use strict';

//searches yelp based on a random state and price range, then gets you a random location from the top 20 and tweets it
function randomRestaurant(){
	var unitedStates = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'NewHampshire', 'NewJersey', 'NewMexico', 'NewYork', 'NorthCarolina', 'NorthDakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'RhodeIsland', 'SouthCarolina', 'SouthDakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'WestVirginia', 'Wisconsin', 'Wyoming'];

	client.search({
		price: Math.floor(Math.random() *4)+1,
		location: unitedStates[Math.floor(Math.random() *50)]
	}).then(response => {
		let randNum = 0;
		if(response.jsonBody.total >= 20){
			randNum = Math.floor(Math.random() * 20);
		} else{
			randNum = Math.floor(Math.random() * response.jsonBody.total);
		}
		console.log("total: ", response.jsonBody.total, "randNum: ", randNum);
	 	T.post('statuses/update', {status: 'Try ' + response.jsonBody.businesses[randNum].name + ' in ' + response.jsonBody.businesses[randNum].location.city + ', ' + response.jsonBody.businesses[randNum].location.state}, function(err, data, response) {
	 		console.log('tweeted');
		})
		// console.log('Try ' + response.jsonBody.businesses[randNum].name + ' in ' + response.jsonBody.businesses[randNum].location.city + ', ' + response.jsonBody.businesses[randNum].location.state);

	}).catch(e => {
	  console.log(e);
	  return e;
	});
}

//searches yelp with a particular filter and gets you a random location from the top 20
//then calls the makeTweet function to respond to the user 
function findRestaurant(someone, id, type, val, loc){
	if (type == "price"){ //if we are searching by the price
		console.log("Price");
		client.search({
			price: val,
			location: loc
		}).then(response => {
			let randNum = 0;
			if(response.jsonBody.total >= 20){
				randNum = Math.floor(Math.random() * 20);
			} else{
				randNum = Math.floor(Math.random() * response.jsonBody.total);
			}
		 	makeTweet(someone, 'Try ' + response.jsonBody.businesses[randNum].name + ' in ' + response.jsonBody.businesses[randNum].location.city + ', ' + response.jsonBody.businesses[randNum].location.state + '\nRating: ' + response.jsonBody.businesses[randNum].rating + ' ★\'s \nPrice: ' + response.jsonBody.businesses[randNum].price, id);

		}).catch(e => {
		  console.log(e);
		  return e;
		});
	} else{ //if we are searching by some type of food/keyword
		console.log("Term");
		client.search({
			term: val,
			location: loc
		}).then(response => {
			let randNum = 0;
			if(response.jsonBody.total >= 20){
				randNum = Math.floor(Math.random() * 20);
			} else{
				randNum = Math.floor(Math.random() * response.jsonBody.total);
			}
		 	makeTweet(someone, 'Try ' + response.jsonBody.businesses[randNum].name + ' in ' + response.jsonBody.businesses[randNum].location.city + ', ' + response.jsonBody.businesses[randNum].location.state + '\nRating: ' + response.jsonBody.businesses[randNum].rating + ' ★\'s \nPrice: ' + response.jsonBody.businesses[randNum].price, id);

		}).catch(e => {
		  console.log(e);
		  return e;
		});
	}//end else
}//end findRestaurant

//creates the tweet to be posted and resets the interval for autotweeting
function makeTweet(replyTo, rec, id){
	clearInterval(autoTweet);
	T.post('statuses/update', {status: '@' + replyTo + ' ' + rec, in_reply_to_status_id: id}, function(err, data, response) {
  		console.log("Tweeted: ", rec);
  		autoTweet = setInterval(randomRestaurant, 3600000);
	})
	console.log("@" + replyTo, rec);
}

//gets all the tweets that are tweeted at the bot in real time
//if the tweet contains $ signs then it will call findRestaurant with a "price" parameter
//else findRestaurant will be called with a "term" parameter
var stream = T.stream('statuses/filter', { track: '@jifjambot' })
stream.on('tweet', function (tweet) {
  var myTweet = tweet.text.split(" ");
  console.log(myTweet[1])
  // console.log("parseFloat", parseFloat(myTweet[1]))
  if (myTweet[1] === "$" || myTweet[1] === "$$" || myTweet[1] === "$$$" || myTweet[1] === "$$$$"){
  	  findRestaurant(tweet.user.screen_name, tweet.id_str, "price", myTweet[1].length, myTweet[2]);	
  } else{
  	  findRestaurant(tweet.user.screen_name, tweet.id_str, "term", myTweet[1], myTweet[2]);
  }
})


//auto tweet a new restaurant after 1 hour of inactivity
var autoTweet = setInterval(randomRestaurant, 3600000);
