'use strict'

const gulp = require('gulp');
const stylus = require('gulp-stylus');
const concat = require('gulp-concat'); // склеивает два css в один - имя подаем
const debug = require('gulp-debug'); // отображает весь процесс 
const sourcemaps = require('gulp-sourcemaps'); // map file
const gulpIf = require('gulp-if'); // проверка условия на этапе выполнения потоков
const del = require('del');
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('styles', function() {
    return gulp.src('frontend/styles/main.styl')
        .pipe(gulpIf(isDevelopment, sourcemaps.init())) // file.sourceMap (пустая)
        .pipe(stylus())
        .pipe(gulpIf(isDevelopment, sourcemaps.write())) // итоговая map - для разработки лучше когда внутри самого файла находится
        .pipe(gulp.dest('public'));
});

gulp.task('clean', function() {
    return del('public');
});

gulp.task('assets', function() {
    return gulp.src('frontend/assets/**', {since: gulp.lastRun('assets')})
        .pipe(debug({title: 'assets'}))
        .pipe(gulp.dest('public'));
});

gulp.task('build', gulp.series(
    'clean', 
    gulp.parallel('styles', 'assets'))
);

gulp.task('watch', function() {
    // наблюдает за изменениями в файле styles и сразу все пересобирается! 
    gulp.watch('frontend/styles/**/*.*', gulp.series('styles'));

    gulp.watch('frontend/assets/**/*.*', gulp.series('assets'));
});

gulp.task('dev', gulp.series('build', 'watch'));