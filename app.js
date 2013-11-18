
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

var VALID_API_KEYS = [
  "asd8X234asfdwerknsdf1xhasdfwr234afsd123jasdfjertvxcv"
]

var openSockets = {

}

var validApiKey = function(apiKey) {
  return (_.indexOf(VALID_API_KEYS, apiKey) > 0);
}

io.sockets.on('connection', function (socket) {

  socket.on('configure', function(data, fn) {
    if (validApiKey(data.apiKey)) {
      socket.emit('configure', 'success');

      if (openSockets[apiKey] === undefined) {
        openSockets[apiKey] = []
      }

      openSockets[apiKey].push(socket);
    } else {
      socket.emit('configure', 'error');
    }
  });

  socket.on('echo', function(data) {
    socket.emit('echo back', data);
  });

});
