gulp = require('gulp')
coffee = require('gulp-liveScript')
browserify = require('gulp-browserify')
plumber = require('gulp-plumber')
rename = require('gulp-rename')

exports.compile = (path_src, path_dest) ->
  return gulp.src(path_src, { read: false })
      .pipe(plumber())
      .pipe(browserify({
        transform: ['liveify']
        extensions: ['.ls']
      }))
      .pipe(rename('main.js'))
      .pipe(gulp.dest(path_dest))