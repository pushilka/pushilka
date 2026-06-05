const gulp = require('gulp');
const uglify = require('gulp-uglify');
const uglifycss = require('gulp-uglifycss');
const { rollup } = require('rollup');
const terser = require('@rollup/plugin-terser');

async function appBundles() {
    const bundle = await rollup({
        input: 'src/app.js',
        plugins: [terser()],
    });
    await Promise.all([
        bundle.write({
            file: 'dist/app.js',
            format: 'iife',
            name: 'Pushilka',
        }),
        bundle.write({
            file: 'dist/app.esm.js',
            format: 'es',
        }),
    ]);
    await bundle.close();
}

function otherScripts() {
    return gulp.src(['src/*.js', '!src/app.js'])
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
}

function css() {
    return gulp.src('src/*.css')
        .pipe(uglifycss())
        .pipe(gulp.dest('dist/'));
}

function images() {
    return gulp.src('src/*.{webp,jpg,png,gif}')
        .pipe(gulp.dest('dist/'));
}

exports.default = gulp.series(appBundles, otherScripts, css, images);
