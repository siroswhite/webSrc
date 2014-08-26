debug = true
#=============================================================================
# define
#=============================================================================
#-----------------------------------------------------------------------------
# require
#-----------------------------------------------------------------------------
gulp = require('gulp')
myTask = require('./myTask')
cp = require('child_process')

#-----------------------------------------------------------------------------
# projectName
#-----------------------------------------------------------------------------
projectList = [
  "sirolabo"
  "HundredHP"
  "HundredProduct"
  "game"
  "attic"
]

name_project = projectList[0]
console.log("name_project: " + name_project)

#-----------------------------------------------------------------------------
# path
#-----------------------------------------------------------------------------
path_project = {}
path_project.root = "../../" + name_project + "/"
path_project.code = path_project.root + "code/"
path_project.src = path_project.root + "src/"

path_webSrc = {}
path_webSrc.root = "../"
path_webSrc.code = path_webSrc.root + "code/"
path_webSrc.src = path_webSrc.root + "src/"
path_webSrc.node_modules = path_webSrc.root + "code/node_modules/"

#-----------------------------------------------------------------------------
# watchList
#-----------------------------------------------------------------------------
watchList = {
  # jade: {
  #   taskName: "jade"
  #   pathList_watch: [path_webSrc.code + 'view/**/*.jade', path_project.code + "view/**/*.jade"]
  # }
  stylus: {
    taskName: "stylus"
    pathList_watch: [path_webSrc.code + 'css/**/*.styl', path_project.code + "css/**/*.styl"]
  }
  coffee: {
    taskName: "coffee"
    pathList_watch: [path_webSrc.node_modules + '**/*.coffee', path_project.code + "js/**/*.coffee"]
  }
  coffeeDoc: {
    taskName: "coffeeDoc"
    pathList_watch:['../doc/main.coffee']
  }
  jsduck: {
    taskName: "jsduck"
    pathList_watch:['../doc/main.js']
  }
  server: {
    taskName: "server"
    pathList_watch:['../server/**/*.coffee']
  }
}


#=============================================================================
# task
#=============================================================================
#-----------------------------------------------------------------------------
# jade
#-----------------------------------------------------------------------------
gulp.task('jade', ->
  myTask.jade(
      [path_webSrc.code + 'view/**/[^_]*.jade', path_project.code + 'view/**/[^_]*.jade']
    , path_project.src + "view/"
  )
)

#-----------------------------------------------------------------------------
# coffee
#-----------------------------------------------------------------------------
gulp.task('coffee', ->
  myTask.coffee(
      [path_project.code + "js/main.coffee"]
    , path_project.src + "js/"
  )
)

#-----------------------------------------------------------------------------
# liveScript
#-----------------------------------------------------------------------------
gulp.task('liveScript', ->
  myTask.liveScript(
      [path_project.code + "ls/main.ls"]
    , path_project.src + "js/"
  )
)

#-----------------------------------------------------------------------------
# coffeeDoc
#-----------------------------------------------------------------------------
gulp.task('coffeeDoc', ->
  myTask.coffee(
      ["../doc/main.coffee"]
    , "../doc/"
  )
)

#-----------------------------------------------------------------------------
# jsduck
#-----------------------------------------------------------------------------
gulp.task('jsduck', ->
  cp.exec('jsduck ../doc/main.js --output ../doc/html/ --title "websrc document"')
)

#-----------------------------------------------------------------------------
# node
#-----------------------------------------------------------------------------
gulp.task('server', ->
  myTask.nodeCoffee(
      ["../server/core.coffee"]
    , "../server/"
  )
)

#-----------------------------------------------------------------------------
# stylus
#-----------------------------------------------------------------------------
gulp.task('stylus', ->
  myTask.stylus(
      [path_project.code + 'css/style.styl']
    , path_project.src + 'css/'
  )
)

#-----------------------------------------------------------------------------
# default
#-----------------------------------------------------------------------------
gulp.task('default', ->
  myTask.watch(watchList)
)