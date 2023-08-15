const {series, src, dest} = require('gulp');
const uglify = require('gulp-uglify');
const uglifycss = require('gulp-uglifycss');

function scripts() {
    return src('src/*.js')
        .pipe(uglify())
        .pipe(dest('dist/'));
}

function css() {
    return src('src/*.css')
        .pipe(uglifycss())
        .pipe(dest('dist/'))
}

function images() {
    return src('src/*.{webp,jpg,png,gif}')
        .pipe(dest('dist/'));
}

exports.default = series(scripts, css, images)
