'use strict';


const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');

const sitename = 'tropicali'; // set your siteName here
const username = 'ms'; // set your macOS userName here
const browserSync = require('browser-sync').create();

const imagemin = require('gulp-imagemin');

sass.compiler = require('node-sass');

gulp.task('sass', () => {
  return gulp.src('src/css/app.scss')
    .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(
        cleanCSS({
          compatibility: 'ie8'
        })
      )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('html', () => {
  return gulp.src("src/*.html")
    .pipe(gulp.dest("dist"))
})
gulp.task('fonts', () => {
  return gulp.src("src/fonts/*")
    .pipe(gulp.dest("dist/fonts"))
})
gulp.task('images', () => {
  return gulp.src("src/img/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/img"))
})

gulp.task('watch', () => {
  browserSync.init({

      proxy: sitename +'.test',
     // or if site is http comment out below block and uncomment line above
     /*
      proxy: 'https://' + sitename + '.test',
      host: sitename + '.test',
      open: 'external',
      port: 8000,
      https: {
        key:
          '/Users/' + username + '/.config/valet/Certificates/' + sitename + '.test.key',
        cert:
          '/Users/' + username + '/.config/valet/Certificates/' + sitename + '.test.crt',
      }
      */
  });

  gulp.watch('src/*.html', gulp.series("html")).on('change',browserSync.reload);
  gulp.watch('src/css/app.scss', gulp.series("sass")).on('change',browserSync.reload);
  gulp.watch('src/fonts/*', gulp.series("fonts"));
  gulp.watch('src/fonts/*', gulp.series("images"));
  

});

gulp.task("default", gulp.series("html", "fonts", "images", "sass", "watch"));


