const express = require("express");
const https = require("https"); // Already installed with nodeJS
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/index.html")
});


app.post("/", function(req, res) {
	const city = req.body.cityName;
	const apiKey = "your-api-key";
	const unit = "metric";
	const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=" + unit;

	https.get(url, function(response) {
		console.log(response.statusCode);

		// ON receipt of data...
		response.on("data", function(data) {
			const weatherData = JSON.parse(data);
			const temp = weatherData.main.temp;
			const description = weatherData.weather[0].description;
			const icon = weatherData.weather[0].icon;
			const imageURL = "https://openweathermap.org/img/wn/"+icon+"@2x.png";

			res.write("<h1>The temperature in " + city + " is " + temp + " degrees Celcius</h1>");
			res.write("<p>The weather feels like " + description + "</p>");
			res.write('<img src="'+imageURL+'">');
			res.send();
		});
	});
});



app.listen(3000);