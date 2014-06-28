gulp = require('gulp')
jade = require('gulp-jade')
plumber = require('gulp-plumber')

exports.compile = (path_src, path_dest) ->
  return gulp.src(path_src)
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(path_dest))