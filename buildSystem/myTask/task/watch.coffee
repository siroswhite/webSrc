gulp = require('gulp')

exports.start = (watchList) ->
  for key, list of watchList
    gulp.watch(
        list.pathList_watch
      , [list.taskName]
    )