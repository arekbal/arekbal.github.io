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
var fileInclude = require('gulp-file-include')
var merge = require('event-stream').merge


var is_debug = true
var is_autorefresh = false
var is_win8_notifier = true

var notifier = null

if(is_win8_notifier)
{
var WindowsToaster = require('node-notifier').WindowsToaster;
notifier = new WindowsToaster({
  withFallback: true, // Fallback to Growl or Balloons?
  customPath: void 0 // Relative path if you want to use your fork of toast.exe
})
}
else
{
var Growl = require('node-notifier').Growl;
notifier = new Growl({
  name: 'Growl Name Used', // Defaults as 'Node'
  host: 'localhost',
  port: 23053
})
}

var notify = require('gulp-notify').withReporter(notifier.notify.bind(notifier))

function task_clean() {
  gutil.log(arguments.callee.name)
  return gulp.src('build', { read: false })
    .pipe(clean())
    .pipe(notify({title: "SUCCESS", message: arguments.callee.name}))
}

function task_jade() {
  gutil.log(arguments.callee.name)
  return gulp.src(['./client/templates/**/*.jade', '!./client/templates/index.jade', '!./client/templates/**/*.tmpl.jade'])
    .pipe(plumber({errorHandler: notify.onError("<%=error.message%>")}))
    .pipe(fileInclude())
    .pipe(changed('./build/client/templates'))
    .pipe(jade(
    {
      locals: { 
        debug: is_debug,    
      }
    }))
    .pipe(gulp.dest('./build/client/templates'))
    .pipe(notify({title: "SUCCESS", message: arguments.callee.name}))
}

function task_jadeIndex() {
  gutil.log(arguments.callee.name)
  return gulp.src('./client/templates/index.jade')
    .pipe(plumber({errorHandler: notify.onError("<%=error.message%>")}))
    .pipe(fileInclude())
    .pipe(jade(
    {
      locals: 
      {
        autorefresh : is_autorefresh,
        debug: is_debug,
        styles: [
          'build/client/styles/site.css'
        ],
        scripts: [
          'http://knockoutjs.com/downloads/knockout-3.3.0.js',
          'http://mbest.github.io/knockout.punches/knockout.punches.min.js', // bites with mustache
          'https://cdnjs.cloudflare.com/ajax/libs/three.js/r71/three.js',
          'build/client/app.min.js',
        ]
      }
    }))
    .pipe(gulp.dest('./build/client/templates'))
    .pipe(gulp.dest('.'))
    .pipe(notify({title: "SUCCESS", message: arguments.callee.name}))
}

var tsServerOpts = { target:'ES5', module:'commonjs', typescript: require('typescript') }
var tsClientOpts = { target:'ES5', out: "app.js", typescript: require('typescript') }

function task_ts(){
  gutil.log(arguments.callee.name)
  var tsResult =  gulp.src('./client/**/*.ts')
    .pipe(plumber({errorHandler: notify.onError("<%=error.message%>")}))
    .pipe(changed('./build/client'))
    .on('error', gutil.log)
    //.pipe(sourcemaps.init())
    .pipe(ts(tsClientOpts))
  return tsResult.js
    .pipe(plumber())
    //.pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/client'))
    .pipe(notify({title: "SUCCESS", message: arguments.callee.name}))
}


//TODO: replan this so I could have clean before I recreate files... otherwise some errors
function task_js(){
  gutil.log(arguments.callee.name)
  var result = gulp.src(['./client/**/*.js', './build/client/**/*.js'])
    .on('error', gutil.log)
    .pipe(plumber({errorHandler: notify.onError("<%=error.message%>")}))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./build/client'))   
    
    if(is_debug == false)    
      result = result.pipe(filesize()).pipe(uglify())
    
  return result
    .pipe(rename('app.min.js'))
    .pipe(filesize())        
    .pipe(gulp.dest('./build/client'))
    .pipe(notify({title: "SUCCESS", message: arguments.callee.name}))
}

function task_sass() {
  gutil.log(arguments.callee.name)
  return gulp.src('./client/styles/**/*.sass')
    .pipe(plumber({errorHandler: notify.onError("<%=error.message%>")}))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/client/styles'))
    .pipe(notify({title: "SUCCESS", message: arguments.callee.name}))
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
  
  return merge(task_jade(), task_jadeIndex(), task_ts().on('finish', function () { task_js().on('finish', task_success) }), task_sass())
}

function task_success()
{
  gutil.log(arguments.callee.name)
  
  notifier.notify({
  'title': 'task_success',
  'message': 'SUCCESS',
  })
  
  gutil.log("SUCCESS")
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

gulp.task('success', task_success)
   
gulp.task('clean-build', ['clean'], task_build)

gulp.task('deploy', ['clean'],  task_deploy)
  
gulp.task('default', ['clean-build'], task_watch)  


