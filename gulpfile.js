let gulp = require('gulp');
let uglify = require('gulp-uglify');
let uglifycss = require('gulp-uglifycss');

function scripts() {
    return gulp.src('src/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
}

function css() {
    return gulp.src('src/*.css')
        .pipe(uglifycss())
        .pipe(gulp.dest('dist/'))
}

function images() {
    return gulp.src('src/*.{webp,jpg,png,gif}')
        .pipe(gulp.dest('dist/'));
}

exports.default = gulp.series(scripts, css, images)
