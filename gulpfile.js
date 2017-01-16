var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create(),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify');
	

gulp.task('default', ['styles', 'scripts'], function() {
	gulp.watch('scss/*.scss', ['styles']);
	gulp.watch('source/*.js', ['scripts']);
	gulp.watch('index.html').on('change', browserSync.reload);
	gulp.watch('css/main.css').on('change', browserSync.reload);
	browserSync.init({
		server: "."
	});

});

gulp.task('uglify', [
	'styles',
	'scripts',
]);

gulp.task('styles', function() {
	gulp.src('scss/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('css'))
		.pipe(browserSync.stream());
});

gulp.task('scripts', function() {
	gulp.src('source/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('js'))
		.pipe(uglify())
		.pipe(gulp.dest('js'));
});

