/// <reference path="typings/node/node.d.ts"/>

var path = require('path')
var gulp = require('gulp')
var gutil = require('gulp-util')
var clean = require('gulp-clean')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var filesize = require('gulp-filesize')
var sass = require('gulp-sass')
var changed = require('gulp-changed')
var watch = require('gulp-watch')
var batch = require('gulp-batch')
var plumber = require('gulp-plumber')
var ts = require('gulp-typescript')
var sourcemaps = require('gulp-sourcemaps')
var jade = require('gulp-jade')
var merge = require('event-stream').merge

var fileInclude = require('gulp-file-include')

var is_debug = true

function task_clean() {
  gutil.log(arguments.callee.name)
  return gulp.src('build', { read: false })
    .pipe(clean())
}

function task_jade() {
  gutil.log(arguments.callee.name)
  return gulp.src(['./client/templates/**/*.jade', '!./client/templates/index.jade', '!./client/templates/**/*.tmpl.jade'])
    .pipe(plumber())
    .pipe(fileInclude())
    .pipe(changed('./build/client/templates'))
    .pipe(jade(
    {
      locals: { 
        debug: is_debug,      
      }
    }))
    .pipe(gulp.dest('./build/client/templates'))
}

function task_jadeIndex() {
  gutil.log(arguments.callee.name)
  return gulp.src('./client/templates/index.jade')
    .pipe(plumber())
    .pipe(fileInclude())
    .pipe(jade(
    {
      locals: 
      {
        debug: is_debug,
        styles: [
          'build/client/styles/site.css'
        ],
        scripts: [
          'http://knockoutjs.com/downloads/knockout-3.3.0.js',
          'http://mbest.github.io/knockout.punches/knockout.punches.min.js', // bites with mustache
          'build/client/app.js'
        ]
      }
    }))
    .pipe(gulp.dest('./build/client/templates'))
    .pipe(gulp.dest('.'))
}

var tsServerOpts = { target:'ES5', module:'commonjs', typescript: require('typescript') }
var tsClientOpts = { target:'ES5', out: "app.js", typescript: require('typescript') }

function task_ts(){
  gutil.log(arguments.callee.name)
  var tsResult =  gulp.src('./client/**/*.ts')
    .pipe(plumber())
    .pipe(changed('./build/client'))
    .on('error', gutil.log)
    .pipe(sourcemaps.init())
    .pipe(ts(tsClientOpts))
  return tsResult.js
    .pipe(plumber())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/client'))
}

function task_js(){
  gutil.log(arguments.callee.name)
  return gulp.src('./build/client/**/*.js')
    .on('error', gutil.log)
    .pipe(plumber())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./build/client'))
    .pipe(filesize())
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(filesize())        
    .pipe(gulp.dest('./build/client'))
}

function task_sass() {
  gutil.log(arguments.callee.name)
  return gulp.src('./client/styles/**/*.sass')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/client/styles'))
}

function task_watch()
{
  gutil.log(arguments.callee.name)
  
  gulp.watch('./client/**/*.ts', ['js'])
  gulp.watch('./client/templates/**/*.jade', ['jade-index'])
  gulp.watch(['./client/templates/**/*.jade', '!./client/templates/index.jade'], ['jade'])
  gulp.watch('./client/styles/**/*.sass', ['sass'])
  gulp.watch('./gulpfile.js', ['build'])
}

function task_build()
{
  gutil.log(arguments.callee.name)
  
  return merge(task_jade(), task_jadeIndex(), task_ts().on('finish', task_js), task_sass())
}

function task_deploy()
{
  gutil.log(arguments.callee.name)
  
  is_debug = false
  
  return task_build()
}

gulp.task('clean', task_clean)

gulp.task('sass', task_sass)

gulp.task('ts', task_ts)

gulp.task('js', ['ts'], task_js)

gulp.task('jade', task_jade)

gulp.task('jade-index', task_jadeIndex)

gulp.task('watch', task_watch)

gulp.task('build', task_build)
   
gulp.task('clean-build', ['clean'], task_build)

gulp.task('deploy', ['clean'],  task_deploy)
  
gulp.task('default', ['clean-build'], task_watch)  


