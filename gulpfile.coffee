# import package

gulp = require('gulp')

runSequence = require('run-sequence')
uglify = require('gulp-uglify')
minifyCss=require('gulp-minify-css')
#unCss = require('gulp-uncss')
del = require('del')
browseSync = require('browser-sync').create()

#get parameter


#set up task

gulp.task('default',(callback)->
    runSequence(['clean'],['build'],['serve','watch'],callback)
)

gulp.task('clean', (callback)->
    del(['./disk/'],callback)
)

gulp.task('build',(callback) ->
    runSequence(['copy','miniJS','miniCss'],callback)
)

gulp.task('copy', ->
    gulp.src('./src/**/*.*')
        .pipe(gulp.dest('./dist/'))
)

gulp.task('miniJS', ->
    gulp.src('./src/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist'))
)

gulp.task('miniCss', ->
    gulp.src('./src/**/*.css')
        .pipe(minifyCss())
        #.pipe(unCss)
        .pipe(gulp.dest('./dist'))
)

gulp.task('concat', ->
    gulp.src('./src/*.js')
        .pipe(concat('all.js',{newLine: ':\n'}))
        .pipe(gulp.dest('./dist'))
)

gulp.task('serve', ->
    browseSync.init({
        server:{
            baseDir: './dist'
        }
        port:7411
    })
)

gulp.task('watch', ->
    gulp.watch('./src/**/*.*',['reload'])
)

gulp.task('reload', (callback)->
    runSequence(['build'],['reload-browser'],callback);
)

gulp.task('reload-browser', ->
    browseSync.reload()
)