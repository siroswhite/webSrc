require('node-monkey').start({host: "127.0.0.1", port:"50500"})
express = require('express')
logger = require('morgan')
http = require("http")
path = require("path")
fs = require("fs")
socketIO = require('socket.io')

app = express()
rootPath = __dirname + "/../../game"

#config
app.use(logger('dev'))
app.set('port', process.env.PORT || 1234)
#app.use(express.favicon());

app.use('/code', express.static(path.join(rootPath, '/webroot/code')))
app.use('/src', express.static(path.join(rootPath, '/webroot/src')))
app.set('view engine', 'jade')
app.set('views', __dirname + "/view")


app.get('/', (req, res) ->
	res.render(rootPath + "/code/jade/index", {title: "test", pretty: true})
)

server = http.createServer(app)
server.listen(app.get("port"), ()->
  console.log("Express server listening on port " + app.get("port"))
) 

io = socketIO.listen(server)
io.on('connection', (socket) ->
	socket.on('systemEditor_save', (saveData)->
		fs.writeFile('systemEditor.txt', saveData, (err) ->
			console.log err
		)
	)

	socket.on('systemEditor_load', ()->
		fs.readFile('systemEditor.txt', (err, data) ->
			console.log err if err
			io.sockets.emit 'systemEditor_load_end', JSON.parse(data)
		)
	)
)