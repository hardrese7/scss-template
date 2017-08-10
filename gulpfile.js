var autoprefixer    = require('gulp-autoprefixer');
var browserSync     = require('browser-sync').create();
var cache           = require('gulp-cache');
var cleanCSS        = require('gulp-clean-css');
var del             = require('del');
var gulp            = require('gulp');
var sass            = require('gulp-sass');
var notify          = require("gulp-notify");
var rename          = require('gulp-rename');
var imagemin        = require('gulp-imagemin');

/*======  Path variables  ======*/
var dist = 'dist';
var src = 'src';
var scssPath = `${src}/scss/*.scss`;
var cssPath = `${dist}/css`;
var imgSrcPath = `${src}/img/**/*`;
var imgDistPath = `${dist}/img`
var htmlPath = '*.html';
/*======  /Path variables  ======*/

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch(scssPath, ['sass']);
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

gulp.task('imagemin', function() {
	return gulp.src(imgSrcPath)
	.pipe(cache(imagemin()))
	.pipe(gulp.dest(imgDistPath));
});

gulp.task('clearcache', function () { return cache.clearAll(); });
gulp.task('removedist', function() { return del.sync(dist); });
gulp.task('default', ['serve']);
