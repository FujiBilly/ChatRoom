var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');

gulp.task('watch', function(){
	var lr = livereload();
	gulp.watch('views/*,public/*', function(file){
		lr.changed(file.path);
	});
});

gulp.task('server', function(){
	nodemon({
		script: './bin/www',
		ext: 'js json'
	});
});

gulp.task('default', function(){
	gulp.start('server', 'watch');
});