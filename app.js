
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var _ = require('underscore')._;

var VALID_API_KEYS = [
  "asd8X234asfdwerknsdf1xhasdfwr234afsd123jasdfjertvxcv"
]

var openSockets = {}

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var validApiKey = function(apiKey) {
  return (_.indexOf(VALID_API_KEYS, apiKey) >= 0);
}

var addOpenSocket = function(apiKey, userId, socket) {
  if (openSockets[apiKey] === undefined) {
    openSockets[apiKey] = []
  }
  if (openSockets[apiKey][userId] === undefined) {
    openSockets[apiKey][userId] = []
  }

  openSockets[apiKey][userId].push(socket);
}

io.sockets.on('connection', function (socket) {

  socket.on('configure', function(data, fn) {
    var apiKey = data.apiKey;
    var userId = data.userId;

    if (validApiKey(apiKey)) {
      socket.emit('configure', 'success');

      addOpenSocket(apiKey, userId, socket);
    } else {
      socket.emit('configure', 'error');
    }
  });

  socket.on('echo', function(data) {
    socket.emit('echo back', data);
  });

});
