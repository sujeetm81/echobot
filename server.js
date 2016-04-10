const fs = require('fs');
const restify = require('restify');
const skype = require('skype-sdk');

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
    bot.reply('Hello ${data.fromDisplayName}!', true);
});

botService.on('personalMessage', (bot, data) => {
    bot.reply('Hey ${data.from}. Thank you for your message: "${data.content}".', true);
});

const server = restify.createServer();
server.post('/v1/chat', skype.messagingHandler(botService));
const port = 8080;
server.listen(port);
console.log('Listening for incoming requests on port ' + port);
