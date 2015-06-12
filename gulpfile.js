/// <reference path="typings/node/node.d.ts"/>

var path = require('path')
var gulp = require('gulp')
var gutil = require('gulp-util')
var clean = require('gulp-clean')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var filesize = require('gulp-filesize')
var less = require('gulp-less')
var changed = require('gulp-changed')
var watch = require('gulp-watch')
var batch = require('gulp-batch')
var plumber = require('gulp-plumber')
var ts = require('gulp-typescript')
var sourcemaps = require('gulp-sourcemaps')

gulp.task('clean', function () {
    return gulp.src('build', { read: false })
        .pipe(clean())
})

var tsServerOpts = { target:'ES5', module:'commonjs', typescript: require('typescript') }
var tsClientOpts = { target:'ES5', out: "_app.js", typescript: require('typescript') }

// gulp.task('ts-server', function () {
//    var tsResult =  gulp.src('./server/**/*.ts')
//         .on('error', gutil.log)
//         .pipe(sourcemaps.init())
//         .pipe(ts(tsServerOpts))
//   return tsResult.js
//         .pipe(sourcemaps.write('/'))
//         .pipe(gulp.dest('./build/server'))
// })

gulp.task('ts-client', function () {
  var tsResult =  gulp.src('./client/**/*.ts')
        .on('error', gutil.log)
        .pipe(sourcemaps.init())
        .pipe(ts(tsClientOpts))
  return tsResult.js
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('./build/client'))
})

gulp.task('js-min', ['ts-client'], function () {
    return gulp.src('./build/client/**/*.js')
        .on('error', gutil.log)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./build'))
        .pipe(filesize())
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('./build'))
        .pipe(filesize())        
        .pipe(gulp.dest('./public/scripts'))
        
})

gulp.task('css', function () {
    return gulp.src('./client/styles/**/*.less')
        .on('error', gutil.log)
        .pipe(changed('build/css'))
        .pipe(less({
          paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('./build/css'))
        .pipe(gulp.dest('./public/styles'))        
})

gulp.task('watch', function() {
  gulp.watch('./server/**/*.ts', ['ts-server'])
  gulp.watch('./client/**/*.ts', ['ts-client'])
  gulp.watch('./client/styles/**/*.less', 'css')
});


//gulp.task('ts:watch', function () {
//    watch(tsScripts, function (vinyl) { 
//         
//      gutil.log('Watch \'' + gutil.colors.yellow(tsScripts) + '\': \'' + gutil.colors.blue(vinyl.relative) + '\'')
//      
//      return gulp.src(tsScripts)
//          .pipe(changed('public/scripts'))
//          .pipe(plumber())
//          .pipe(ts(serverTsOpts))
//          .pipe(gulp.dest('public/scripts'))
//          .on('error', gutil.log)
//        })
//});

// Rerun the task when a file changes

gulp.task('default', [
  'ts-server', 
  'js-min',
  //'css',
  //'watch'
  ])
