gulp = require('gulp')
stylus = require('gulp-stylus')
plumber = require('gulp-plumber')
nib = require('nib')

exports.compile = (path_src, path_dest) ->
  return gulp.src(path_src)
    .pipe(plumber())
    .pipe(stylus({
      use: [nib()]
    }))
    .pipe(gulp.dest(path_dest))
