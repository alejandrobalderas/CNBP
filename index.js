require('dotenv').config();
const static = require('node-static');
const ws = require('ws');
const http = require('http');
const ConversationV1 = require('watson-developer-cloud/conversation/v1');

var conversation = new ConversationV1({
    version: '2018-09-20',
    username: process.env.WATSON_API_USERNAME,
    password: process.env.WATSON_API_PASSWORD,
    url: 'https://gateway.watsonplatform.net/assistant/api'
});

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

  conversation.message({
    workspace_id: process.env.WATSON_WORKSPACE_ID,
    input: {'text': ``}
  },  function(err, response) {
    if (err) {
      console.log('error:', err);
    } else {
      //console.log(JSON.stringify(response, null, 2));
      ws.send(JSON.stringify(response))
    }

  });

  ws.on('message', function incoming(data) {
    console.log('received: %s', data);

    data = JSON.parse(data);

    conversation.message({
      workspace_id: process.env.WATSON_WORKSPACE_ID,
      input: {'text': data.text},
      context : data.context
    },  function(err, response) {
      if (err) {
        console.log('error:', err);
      } else {
        //console.log(JSON.stringify(response, null, 2));
        ws.send(JSON.stringify(response))
      }

    });

    //ws.send('something');
  });
});

server.listen(8080);
