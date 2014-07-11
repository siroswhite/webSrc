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
  "Sirolabo"
  "world"
  "HundredHP"
  "HundredProduct"
]

name_project = projectList[2]
console.log("name_project: " + name_project)

#-----------------------------------------------------------------------------
# path
#-----------------------------------------------------------------------------
path_project = {}
path_project.root = "../../" + name_project + "/"
path_project.code = path_project.root + "code/"
path_project.src = path_project.root + "src/"
path_project.webroot = path_project.root + "webroot/"
path_project.webroot_code = path_project.webroot + "code/"
path_project.webroot_src = path_project.webroot + "src/"

path_webSrc = {}
path_webSrc.root = "../"
path_webSrc.code = path_webSrc.root + "code/"
path_webSrc.src = path_webSrc.root + "src/"
path_webSrc.node_modules = path_webSrc.root + "node_modules/"

#-----------------------------------------------------------------------------
# watchList
#-----------------------------------------------------------------------------
watchList = {
  jade: {
    taskName: "jade"
    pathList_watch: [path_webSrc.code + 'jade/**/*.jade', path_project.code + "jade/**/*.jade"]
  }
  stylus: {
    taskName: "stylus"
    pathList_watch: [path_webSrc.code + 'stylus/**/*.styl', path_project.code + "stylus/**/*.styl"]
  }
  coffee: {
    taskName: "coffee"
    pathList_watch: [path_webSrc.node_modules + '**/*.coffee', path_project.code + "coffee/**/*.coffee"]
  }
  coffeeDoc: {
    taskName: "coffeeDoc"
    pathList_watch:['../doc/main.coffee']
  }
  jsduck: {
    taskName: "jsduck"
    pathList_watch:['../doc/main.js']
  }
# liveScript: {
#   taskName: "liveScript"
#   pathList_watch: [path_webSrc.node_modules + '**/*.ls', path_project.code + "ls/**/*.ls"]
# }
}


#=============================================================================
# task
#=============================================================================
#-----------------------------------------------------------------------------
# jade
#-----------------------------------------------------------------------------
gulp.task('jade', ->
  myTask.jade(
      [path_webSrc.code + 'jade/**/[^_]*.jade', path_project.code + 'jade/**/[^_]*.jade']
    , path_project.webroot
  )
)

#-----------------------------------------------------------------------------
# coffee
#-----------------------------------------------------------------------------
gulp.task('coffee', ->
  myTask.coffee(
      [path_project.code + "coffee/main.coffee"]
    , path_project.webroot_code + "js/"
  )
)

#-----------------------------------------------------------------------------
# liveScript
#-----------------------------------------------------------------------------
gulp.task('liveScript', ->
  myTask.liveScript(
      [path_project.code + "ls/main.ls"]
    , path_project.webroot_code + "js/"
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
# stylus
#-----------------------------------------------------------------------------
gulp.task('stylus', ->
  myTask.stylus(
      [path_project.code + 'stylus/main.styl']
    , path_project.webroot_code + 'css/'
  )
)

#-----------------------------------------------------------------------------
# default
#-----------------------------------------------------------------------------
gulp.task('default', ->
  myTask.watch(watchList)
)