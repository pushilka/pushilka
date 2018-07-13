var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    pump = require('pump');

gulp.task('scripts', function(cb) {
    return pump([
        gulp.src('src/*'),
        uglify(),
        gulp.dest('dist/')
    ]);
});

gulp.task('default', ['scripts']);