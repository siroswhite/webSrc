var app, express, fs, http, io, logger, path, rootPath, server, socketIO;

require('node-monkey').start({
  host: "127.0.0.1",
  port: "50500"
});

express = require('express');

logger = require('morgan');

http = require("http");

path = require("path");

fs = require("fs");

socketIO = require('socket.io');

app = express();

rootPath = __dirname + "/../../game";

app.use(logger('dev'));

app.set('port', process.env.PORT || 1234);

app.use('/code', express["static"](path.join(rootPath, '/webroot/code')));

app.use('/src', express["static"](path.join(rootPath, '/webroot/src')));

app.set('view engine', 'jade');

app.set('views', __dirname + "/view");

app.get('/', function(req, res) {
  return res.render(rootPath + "/code/jade/index", {
    title: "test",
    pretty: true
  });
});

server = http.createServer(app);

server.listen(app.get("port"), function() {
  return console.log("Express server listening on port " + app.get("port"));
});

io = socketIO.listen(server);

io.on('connection', function(socket) {
  socket.on('systemEditor_save', function(saveData) {
    return fs.writeFile('systemEditor.txt', saveData, function(err) {
      return console.log(err);
    });
  });
  return socket.on('systemEditor_load', function() {
    return fs.readFile('systemEditor.txt', function(err, data) {
      if (err) {
        console.log(err);
      }
      return io.sockets.emit('systemEditor_load_end', JSON.parse(data));
    });
  });
});
