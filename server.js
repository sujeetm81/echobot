const fs = require('fs');
const restify = require('restify');
const skype = require('skype-sdk');
var YQL = require('yql');

const botService = new skype.BotService({
    messaging: {
        botId: '28:<bot’s id="">',
        serverUrl : "https://apis.skype.com",
        requestTimeout : 15000,
        appId: '74717835-d950-4822-bfb3-85c7573f16e9',
        appSecret: '1SkRqV6PZHATbyfvbviM0qe'
    }
});

botService.on('contactAdded', (bot, data) => {
    bot.reply('Hello "${data.fromDisplayName}"!', true);
});

botService.on('personalMessage', (bot, data) => {
    var query = new YQL('select * from weather.forecast where (location = ' + data.content + ')');

    query.exec(function(err, data) {
    var location = data.query.results.channel.location;
    var condition = data.query.results.channel.item.condition;
  
    console.log('The current weather in ' + location.city + ', ' + location.region + ' is ' + condition.temp + ' degrees.');
    bot.reply('The current weather in ' + location.city + ', ' + location.region + ' is ' + condition.temp + ' degrees.', true);
    });
});

const server = restify.createServer();
server.post('/v1/chat', skype.messagingHandler(botService));
const port = process.env.PORT || 8080;
server.listen(port);
console.log('Listening for incoming requests on port ' + port);
process.on('SIGINT', () => {    
    console.log(' Shutting down...');     
    server.close();
});

