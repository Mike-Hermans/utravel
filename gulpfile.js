var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var cleancss = require('gulp-clean-css');

var paths = {
	scripts: 'lib/scripts/**/*.js',
	images: 'lib/img/**/*',
	less: 'lib/less/**/*.less'
};

gulp.task('watch', ['build'], function() {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});

	gulp.watch(paths.less, ['less']);
	gulp.watch('./**/*.html').on('change', browserSync.reload);
	gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('less', function () {
	return gulp.src(paths.less)
		.pipe(plumber())
		.pipe(less())
		.pipe(cleancss())
		.pipe(gulp.dest('./dist/'))
		.pipe(browserSync.stream());
});

gulp.task('scripts', function() {
	return gulp.src(paths.scripts)
		.pipe(plumber())
		.pipe(concat("main.js"))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/'));
});

gulp.task('build', ['less', 'scripts']);