/*======  imports  ======*/
const autoprefixer    = require('gulp-autoprefixer');
const browserSync     = require('browser-sync').create();
const cache           = require('gulp-cache');
const cleanCSS        = require('gulp-clean-css');
const concat          = require('gulp-concat');
const uglify          = require('gulp-uglify');
const del             = require('del');
const gulp            = require('gulp');
const sass            = require('gulp-sass');
const notify          = require("gulp-notify");
const rename          = require('gulp-rename');
const imagemin        = require('gulp-imagemin');
/*======  /imports  ======*/

/*======  Path variables  ======*/
const dist = 'dist';
const src = 'src';

const scssPath = `${src}/scss/**/*.scss`;
const cssPath = `${dist}/css`;
const imgSrcPath = `${src}/img/**/*`;
const imgDistPath = `${dist}/img`;
const jsLibsSrcPath = `${src}/js/libs/**/*.js`;
const jsCommonSrcPath = `${src}/js/common.js`;
const jsDistPath = `${dist}/js`;
const htmlPath = '*.html';
/*======  /Path variables  ======*/

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: "./"
    });

    gulp.watch(scssPath, ['sass']);
    gulp.watch(jsLibsSrcPath, ['js']);
    gulp.watch(jsCommonSrcPath, ['js']);
    gulp.watch(htmlPath).on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(scssPath)
        .pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
        .pipe(rename({suffix: '.min', prefix : ''}))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cleanCSS()) // comment while debuging
        .pipe(gulp.dest(cssPath))
        .pipe(browserSync.stream());
});

// Image minify
gulp.task('im', function() {
	return gulp.src(imgSrcPath)
	.pipe(cache(imagemin()))
	.pipe(gulp.dest(imgDistPath));
});

// Concat and minify all js
gulp.task('js', function() {
    return gulp.src([jsLibsSrcPath, jsCommonSrcPath])
    .pipe(concat('scripts.min.js'))
	.pipe(uglify()) // comment  while debuging
    .pipe(gulp.dest(jsDistPath))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('cc', function () { return cache.clearAll(); }); // clear cache
gulp.task('rd', function() { return del.sync(dist); }); // remove dist
gulp.task('default', ['serve']);
