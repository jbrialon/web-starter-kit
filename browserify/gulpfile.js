// -----------------------------------------------------------------------------
//
//  Gulpfile inspired from web starter kit
//
// -----------------------------------------------------------------------------

'use strict';

// -----------------------------------------------------------------------------
// Dependencies : Include Gulp & Tools We'll Use
// -----------------------------------------------------------------------------

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var fs = require('fs');
var gulpif = require('gulp-if');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var rename = require("gulp-rename");
var changed = require("gulp-changed");
var gutil = require('gulp-util');
var sprite = require('sprity');

//browserify specifics
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// -----------------------------------------------------------------------------
// Configuration : Constant paths
// -----------------------------------------------------------------------------
var constants = {
    BASE_WWW: 'template/',
    SASS_FOLDER: 'src/app/sass',
    MEDIA_FOLDER:'src/assets',
    SPRITES_FOLDER: 'src/assets/sprites',
    FONTS_FOLDER: 'src/fonts',
    JS_FOLDER: 'src',
    CSS_FOLDER: 'dist/css',
    IMG_FOLDER: 'dist/assets/images',
    ASSETS_FOLDER: 'src/assets',
    DIST: 'dist'
};

// -----------------------------------------------------------------------------
// Configuration : variables
// -----------------------------------------------------------------------------

var configVar = {
    minify : false, //minification
    autoprefixer_browsers :
        [
            'last 2 versions',
            'ie >= 10',
            'ff >= 30',
            'chrome >= 34',
            'safari >= 7',
            'opera >= 23',
            'ios >= 8',
            'android >= 4.4',
            'bb >= 10'
        ]
};

// -----------------------------------------------------------------------------
// browserify : bundle the app
// -----------------------------------------------------------------------------

gulp.task('browserify', function () {
  var b = browserify({
    entries: 'src/app.js',
    debug: true
  });

  b.on('log', gutil.log); // output build logs to terminal

  return b.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('app.dist.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(gulpif(configVar.minify === true, uglify()))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/'));
});

 // -----------------------------------------------------------------------------
 // Sprites
 // -----------------------------------------------------------------------------

 gulp.task('sprites', function () {
     return sprite.src({
         src: constants.SPRITES_FOLDER + '/*.png',
         name: 'sprite',
         style: '_sprite.scss',
         cssPath: constants.IMG_FOLDER,
         processor: 'sass',
         'dimension': [{
             ratio: 1, dpi: 0
         }, {
             ratio: 2, dpi: 192
         }],
         orientation: 'binary-tree'
     })
    .pipe(gulpif('*.png', gulp.dest(constants.IMG_FOLDER), gulp.dest(constants.SASS_FOLDER)));
 });


// -----------------------------------------------------------------------------
// Lint JavaScript
// -----------------------------------------------------------------------------

gulp.task('jshint', function () {
    return gulp.src([constants.JS_FOLDER+'/**/*.js', '!'+constants.JS_FOLDER+'/node_modules/**/*.js', '!'+constants.JS_FOLDER+'/app/vendor/*.js'])
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// -----------------------------------------------------------------------------
// Sass compilation : Compile and Automatically Prefix Stylesheets
// -----------------------------------------------------------------------------

gulp.task('styles', function() {
    return sass(constants.SASS_FOLDER, {
        sourcemap: true,
        style: configVar.minify ? 'compressed' : 'expanded'
    })
        .on('error', function (err) {
            console.error('Error', err.message);
        })

        .pipe(autoprefixer({
            browsers: configVar.autoprefixer_browsers,
            cascade: false
        }))

        .pipe(sourcemaps.write('./', {
            includeContent: false,
            sourceRoot: '../sass'
        }))

        .pipe(gulp.dest(constants.CSS_FOLDER))
        .pipe($.size({title: 'styles'}));
});

// -----------------------------------------------------------------------------
// Cache buster to prevent server side caching of assets
// -----------------------------------------------------------------------------

gulp.task('cachebuster', function(){
    fs.writeFile(constants.SASS_FOLDER+'/_cacheBuster.scss', '$cacheBuster:"v=' + new Date().getTime() + '";');
});

// -----------------------------------------------------------------------------
// Clean Output Directory
// -----------------------------------------------------------------------------

gulp.task('clean', del.bind(null, [constants.DIST]));

// -----------------------------------------------------------------------------
// Watchers : Watch Files For Changes & Reload
// -----------------------------------------------------------------------------

gulp.task('serve', ['sprites','styles', 'copy', 'browserify'], function () {
    configVar.minify = false;
    browserSync({
        notify: false,
        port: 3000,
        ghostMode: false,
        files: [constants.CSS_FOLDER+"/**/*.css"]
    });

    gulp.watch([constants.BASE_WWW+'/*.html'], reload);
    gulp.watch([constants.SASS_FOLDER+'/**/*.scss'], ['styles']);
    gulp.watch([constants.JS_FOLDER+'/**/*.js', constants.JS_FOLDER+'/**/*.vue'], ['jshint','browserify']);
    gulp.watch([constants.DIST+'/*.js'], reload);
    gulp.watch([constants.MEDIA_FOLDER+'/**/*'], reload);
    gulp.watch([constants.SPRITES_FOLDER+'/**/*'], ['sprites', reload]);
});




gulp.task('copy:fonts',  function(){
    return gulp.src(constants.FONTS_FOLDER + '/**/*')
        .pipe(gulp.dest(constants.DIST + '/fonts'));
});

gulp.task('copy', function (cb) {
    runSequence(['copy:fonts', 'copy:assets'], cb);
});

gulp.task('copy:assets', function(){
    return gulp.src(constants.ASSETS_FOLDER + '/**/*')
        .pipe(gulp.dest(constants.DIST+ '/assets'));
});

// -----------------------------------------------------------------------------
// Production build : the Default Task
// -----------------------------------------------------------------------------


gulp.task('default', ['clean'], function (cb) {
    configVar.minify = true;
    runSequence('cachebuster','sprites', 'styles', 'copy', ['jshint', 'browserify'] , cb);
});

// -----------------------------------------------------------------------------
// Load custom tasks from the `tasks` directory
// -----------------------------------------------------------------------------

try { require('require-dir')('tasks'); } catch (err) {}
