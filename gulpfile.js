var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create(),
	eslint = require('gulp-eslint'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename');
	


var jsDir=[
	'js/*.js'
]

gulp.task('default',[],function(){
	gulp.watch();
})
