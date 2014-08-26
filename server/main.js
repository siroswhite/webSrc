
/*
	require
 */
var app, io, localPath, path, r, server, webSrcPath;

r = {};

require('node-monkey').start({
  host: "127.0.0.1",
  port: "50500"
});

r.express = require('express');

r.logger = require('morgan');

r.http = require("http");

r.path = require("path");

r.fs = require("fs");

r.socketIO = require('socket.io');

r.jade = require('jade');


/*
	define
 */

app = r.express();

path = {
  local: __dirname + "/../../sirolabo/",
  webSrc: __dirname + "/../"
};

localPath = {
  view: path.local + "code/view/",
  css: path.local + "code/css/",
  src: path.local + "src/"
};

webSrcPath = {
  view: path.webSrc + "code/view/",
  src: path.webSrc + "src/"
};


/*
	config
 */

app.set('port', process.env.PORT || 1234);

app.set('view engine', 'jade');

app.set('views', localPath.view);


/*
	middleware
 */

app.use(r.logger('dev'));

app.use('/src', r.express["static"](r.path.join(path.local, 'src/')));

app.use('/webSrc', r.express["static"](r.path.join(__dirname, 'src/')));

app.use(function(err, req, res, next) {
  console.error(err.stack);
  return res.send(500, 'Fatal Error');
});


/*
	server
 */

server = r.http.createServer(app);

server.listen(app.get("port"), function() {
  return console.log("Express server listening on port " + app.get("port"));
});

io = r.socketIO.listen(server);

io.on('connection', function(socket) {

  /*
  		file
   */
  socket.on('fs_write', function(param) {
    return r.fs.writeFile(param.fileName, param.data, function(err) {
      return console.log(err);
    });
  });
  return socket.on('fs_load', function(param) {
    return r.fs.readFile(param.fileName, function(err, fileData) {
      if (err) {
        console.log(err);
      }
      return io.sockets.emit(param.id + '_end', JSON.parse(fileData));
    });
  });
});


/*
	router
 */

app.get('/*', function(req, res) {
  var param, viewName;
  param = {};
  param.load = {
    canvasEditor: false
  };
  if (req.params[0]) {
    viewName = req.params[0];
  } else {
    viewName = "index";
  }
  return res.render(app.get("views") + viewName + ".jade", {
    filename: req.params[0],
    pretty: true,
    node: param
  }, function(err, html) {
    if (err) {
      return res.send("404 file not found");
    } else {
      return res.end(html);
    }
  });
});
