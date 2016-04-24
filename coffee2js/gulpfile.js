var gulp = require('gulp');
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
//var coffeelint = require('gulp-coffeelint');


//////////////////// CoffeeScript ////////////////////
gulp.task('coffee', function() {
  gulp.src('./*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./public/'));
});