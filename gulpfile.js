// Dynamically import gulp-autoprefixer
let autoprefixer;
import('gulp-autoprefixer').then((module) => {
    autoprefixer = module.default || module;
});

// Keep other requires as they are
const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-ruby-sass');
const browserSync = require('browser-sync').create();

const DEST = 'build/';

gulp.task('scripts', function() {
    return gulp.src([
        'src/js/helpers/*.js',
        'src/js/*.js',
    ])
    .pipe(concat('custom.js'))
    .pipe(gulp.dest(`${DEST}/js`)) // Use template literals for cleaner string interpolation
    .pipe(rename({ suffix: '.min' })) // Note: property name changed to lowercase 'suffix'
    .pipe(uglify())
    .pipe(gulp.dest(`${DEST}/js`))
    .pipe(browserSync.stream());
});

// TODO: Maybe we can simplify how sass compile the minify and unminify version
var compileSASS = function (filename, options) {
  return sass('src/scss/*.scss', options)
        .pipe(autoprefixer('last 2 versions', '> 5%'))
        .pipe(concat(filename))
        .pipe(gulp.dest(DEST+'/css'))
        .pipe(browserSync.stream());
};

gulp.task('sass', function() {
    return compileSASS('custom.css', {});
});

gulp.task('sass-minify', function() {
    return compileSASS('custom.min.css', {style: 'compressed'});
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: './production/index.html'
    });
});

gulp.task('watch', function() {
  // Watch .html files
  gulp.watch('production/*.html', browserSync.reload);
  // Watch .js files
  gulp.watch('src/js/*.js', ['scripts']);
  // Watch .scss files
  gulp.watch('src/scss/*.scss', ['sass', 'sass-minify']);
});

// Default Task
gulp.task('default', gulp.series('browser-sync', 'watch'));