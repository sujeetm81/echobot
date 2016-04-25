const fs = require('fs');
const restify = require('restify');
const skype = require('skype-sdk');
var Wunderground = require('wundergroundnode');

const botService = new skype.BotService({
    messaging: {
        botId: '28:<bot’s id="">',
        serverUrl : "https://dm2p-client-ss.msg.skype.com",
        requestTimeout : 15000,
        appId: '74717835-d950-4822-bfb3-85c7573f16e9',
        appSecret: '1SkRqV6PZHATbyfvbviM0qe'
    }
});

botService.on('contactAdded', (bot, data) => {
    bot.reply('Hello ' +  data.fromDisplayName + '!', true);
});

botService.on('personalMessage', (bot, data) => {
    console.log('personal message');
    var myKey = 'a193f0a5e396aa7d';
    var wunderground = new Wunderground(myKey);
    wunderground.conditions().request(data.content, function(err, response){
    console.log(response.current_observation.weather);
    bot.reply('The current weather in ' + data.content + ' is  ' + response.current_observation.weather, true);
    });
});

botService.on('groupMessage', (bot, data) => {
    console.log('group message: ' + data.content);
    bot.reply('SujeetMBot', true);
    //var myKey = 'a193f0a5e396aa7d';
    //var wunderground = new Wunderground(myKey);
    //wunderground.conditions().request(data.content, function(err, response){
    //console.log(response.current_observation.weather);
    //bot.reply('The current weather in ' + data.content + ' is  ' + response.current_observation.weather, true);
    //});
})

const server = restify.createServer();
server.post('/v1/chat', skype.messagingHandler(botService));
const port = process.env.PORT || 8080;
server.listen(port);
console.log('Listening for incoming requests on port ' + port);
process.on('SIGINT', () => {    
    console.log(' Shutting down...');     
    server.close();
});

