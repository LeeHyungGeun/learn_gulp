var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    connect = require('gulp-connect'),
    minifyCss = require('gulp-minify-css')
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    browserSync = require('browser-sync').create(),
    jshint = require('gulp-jshint'),
    jasmine = require('gulp-jasmine'),
    src = '';

// 1. webserver: set server up by gulp-connect.
gulp.task('webserver', function () {
  connect.server({
    port: 80,
    host: "localhost",
    livereload: true  // whether it is possible reload or not.
  });
});

// 2-1. livereload: reload gulp by gulp-connect, when files have changed.
gulp.task('connectreload', function () {
  src = ['*.html'];
  gulp
  .src(src)
  .pipe(watch(src))
  .pipe(connect.reload());
});

// 2-2. livereload: reload gulpy by gulp-livereload, when files have changed.
gulp.task('livereload', function () {
  src = ['*.html'];
  // Create LiverReLoad server
  livereload.listen();

  // Watch any html file in /, reload on change.
  gulp
  .src(src)
  .pipe(watch(src))
  .on('change', livereload.changed);
});


// 3. uglify: minify files by gulp-uglify.
gulp.task('uglify', function () {
  src = ['js/*.js'];
  gulp
  .src(src)
  .pipe(uglify())
  .pipe(concat('all.js')) // using gulp-concat
  .pipe(gulp.dest('build/js')); // save the file on the path.
});

// 4. minify-css: minify css files by gulp-minify-css.
gulp.task('minify-css', function () {
  src = ['css/*.css'];
  gulp
  .src(src)
  .pipe(minifyCss({compatibility: "ie8"}))  // compatibility(ex: ie7, ie8, or '', '*')
  .pipe(concat('all.css'))
  .pipe(gulp.dest('build/css'));
});

// 5. imagemin: minify image files by gulp-imagemin and imagemin-pngquant.
gulp.task('imagemin', function () {
  src = 'images/*';
  gulp
  .src(src)
  .pipe(imagemin({
      // optimizationLevel: 3,
      progressive: true,
      // interlaced: true
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
  }))
  .pipe(gulp.dest('build/images'));
});

// 6. watch: watch the paths and change on runtime.
gulp.task('watch', function () {
  // do it, if below has changed.
  gulp.watch('js/*.js', ['uglify']);
  gulp.watch('css/*.css', ['minify-css']);
  gulp.watch('images/*', ['imagemin']);
});

// 7. browser-sync: it is automated reload and do host on runtime by browser-sync.
gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch('./*.html').on('change', browserSync.reload);
});

// 8. lint: javascript code test by gulp-jshint.
gulp.task('lint', function () {
  src = 'js/*.js';
  gulp
  .src(src)
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// 9. jasmine: javascript code test by gulp-jasmine.
gulp.task('jasmine', function () {
  src = 'js/*.js';
  gulp
  .src(src)
  .pipe(jasmine());
});

// 10. default
gulp.task('default', ['webserver', /*'connectreload',*/ 'livereload', 'uglify', 'minify-css', 'imagemin', 'watch', 'browser-sync', 'lint', 'jasmine']);
