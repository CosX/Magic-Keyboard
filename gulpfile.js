"use strict";
var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    watchify = require('watchify');

function compile(watch) {
    var extensions = ['.js', '.json', '.es6', '.html'];
    var bundler = watchify(browserify({
        entries: 'index.js',
        extensions: extensions,
        debug: true,
        transform: [babelify]
    }));
    function rebundle() {
        bundler.bundle()
            .on('error', function (err) { console.error(err); this.emit('end'); })
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./dist/'));
    }

    if (watch) {
        bundler.on('update', function () {
            console.log('-> bundling...');
            rebundle();
        });
    }

    rebundle()
}

function watch() {
    return compile(true)
}

gulp.task('build-modules', function () { return compile() })
gulp.task('watch-modules', function () { return watch() })