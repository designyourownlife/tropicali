'use strict';


const gulp = require('gulp');

// CSS
const postcss = require('gulp-postcss');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');

// browser refresh
const sitename = 'tropicali'; // set your siteName here
const username = 'ms'; // set your macOS userName here
const browserSync = require('browser-sync').create();

// images
const imagemin = require('gulp-imagemin');

// github
const ghpages = require('gh-pages');


gulp.task('css', () => {
  return gulp.src([
    'src/css/reset.css',
    'src/css/type.css',
    'src/css/app.css'
  ])
    .pipe(sourcemaps.init())
      .pipe(
        postcss([
          require('autoprefixer'), 
          require('postcss-preset-env')({
            stage: 1, 
            browsers: ["IE 11", "last 2 versions"]
          })
        ])
      )
      .pipe(concat('app.css'))
      .pipe(
        cleanCSS({
          compatibility: 'ie8'
        })
      )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
    // auto-inject into browsers
    .pipe(browserSync.stream());
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
  gulp.watch('src/css/*', gulp.series("css")).on('change',browserSync.reload);
  gulp.watch('src/fonts/*', gulp.series("fonts"));
  gulp.watch('src/img/*', gulp.series("images"));

});

/*
gulp.task("deploy", () => {
  ghpages.publish("dist");
})
*/
// for Gulp version >= 4.0
gulp.task('deploy', done => {
  ghpages.publish("dist")
  done();
});

gulp.task("default", gulp.series("html", "fonts", "images", "css", "watch"));


