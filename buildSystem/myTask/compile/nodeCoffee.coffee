gulp = require('gulp')
coffee = require('gulp-coffee')
plumber = require('gulp-plumber')
rename = require('gulp-rename')

exports.compile = (path_src, path_dest) ->
  return gulp.src(path_src)
      .pipe(plumber())
      .pipe(coffee({bare: true}))
      .pipe(rename('main.js'))
      .pipe(gulp.dest(path_dest))