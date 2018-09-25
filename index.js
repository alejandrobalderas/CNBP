const static = require('node-static');
const ws = require('ws');
const http = require('http');
//
// Create a node-static server instance to serve the './public' folder
//
const file = new static.Server('./public');
const server = http.createServer(function (request, response) {

      request.addListener('end', function () {
          //
          // Serve files!
          //
          file.serve(request, response);
      }).resume();

});

const wss = new ws.Server({ server : server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});


server.listen(8080);
