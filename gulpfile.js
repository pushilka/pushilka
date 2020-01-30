var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    pump = require('pump');

gulp.task('scripts', function(cb) {
    return pump([
        gulp.src('src/*.js'),
        uglify(),
        gulp.dest('dist/')
    ]);
});

gulp.task('css', function(cb) {
    return pump([
        gulp.src('src/*.css'),
        uglifycss(),
        gulp.dest('dist/')
    ]);
});

gulp.task('images', function(cb) {
    return pump([
        gulp.src('src/*.{webp,jpg,png,gif}'),
        gulp.dest('dist/')
    ]);
});

gulp.task('default', gulp.series('scripts', 'css', 'images'));