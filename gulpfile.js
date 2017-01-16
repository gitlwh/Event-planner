var gulp = require('gulp'),
	browserSync = require('browser-sync').create();/*
	browserSync = require('browser-sync').create(),
	eslint = require('gulp-eslint'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename');
	


var jsDir=[
	'js/*.js'
]
*/
gulp.task('default',function(){
	browserSync.init({
		server: "."
	});
})
