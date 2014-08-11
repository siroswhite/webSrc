coffee = require('./compile/coffee.coffee')
nodeCoffee = require('./compile/nodeCoffee.coffee')
liveScript = require('./compile/liveScript.coffee')
jade = require('./compile/jade.coffee')
stylus = require('./compile/stylus.coffee')
watch = require('./task/watch.coffee')

exports.coffee = (path_src, path_dest) ->
  coffee.compile(path_src, path_dest)

exports.nodeCoffee = (path_src, path_dest) ->
  nodeCoffee.compile(path_src, path_dest)

exports.liveScript = (path_src, path_dest) ->
  liveScript.compile(path_src, path_dest)

exports.jade = (path_src, path_dest) ->
  jade.compile(path_src, path_dest)

exports.stylus = (path_src, path_dest) ->
  stylus.compile(path_src, path_dest)

exports.watch = (watchList) ->
  watch.start(watchList)