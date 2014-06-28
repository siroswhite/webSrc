gulp = require('gulp')
coffee = require('gulp-coffee')
browserify = require('gulp-browserify')
plumber = require('gulp-plumber')
rename = require('gulp-rename')

exports.compile = (path_src, path_dest) ->
  return gulp.src(path_src, { read: false })
      .pipe(plumber())
      .pipe(browserify({
        transform: ['coffeeify']
        extensions: ['.coffee']
      }))
      .pipe(rename('main.js'))
      .pipe(gulp.dest(path_dest))