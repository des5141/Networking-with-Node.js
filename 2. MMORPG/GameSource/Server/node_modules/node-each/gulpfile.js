'use strict';

/**
 *
 * Gulpfile for Development Environment
 *
 * */

/** Requires */
var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    mocha = require('gulp-mocha');

/** Create default Gulp task that watches lib js changes */
gulp.task('default', function() {
    gulp.watch('lib/**/*.js', ['lint', 'test']);
});

/** Create lint task using eslint.json */
gulp.task('lint', function() {
    return gulp.src(['lib/**/*.js', 'test/**/*.js'])
        .pipe(eslint({
            config: 'eslint.json'
        }))
        .pipe(eslint.format());
});

/** Create test task that runs Mocha TDD */
gulp.task('test', function() {
    return gulp.src('test/**/*.js', {read: false})
        .pipe(mocha({reporter: 'nyan', ui: 'bdd'}));
});