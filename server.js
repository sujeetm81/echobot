const restify = require('restify');


const server = restify.createServer();
const port = 8080;
server.listen(port);
console.log('Listening for incoming requests on port ' + port);

