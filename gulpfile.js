const gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    tap = require('gulp-tap'),
    clean = require('gulp-clean'),
    filter = require('gulp-filter'),
    path = require('path'),
    del = require('del'),
    runSequence = require('run-sequence'),
    autoprefixer = require('autoprefixer'),
    $ = require('gulp-load-plugins')();

let prod = true;

// 清理
gulp.task('clean', () => {
    return del(['./dist/**', '!./dist'], {
        force: true
    });
});

// JSON文件压缩
gulp.task('json', () => {
    return gulp.src('./src/**/*.json')
        .pipe($.if(prod, $.jsonminify()))
        .pipe(gulp.dest('./dist'));
});

gulp.task('json:watch', () => {
    gulp.watch('./src/**/*.json', ['json']);
});

// 页面文件
gulp.task('templates', () => {
    return gulp.src('./src/**/*.wxml')
        .pipe($.if(prod, $.htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            keepClosingSlash: true
        })))
        .pipe(gulp.dest('./dist'));
});

gulp.task('templates:watch', () => {
    gulp.watch('./src/**/*.wxml', ['templates']);
});

// 资源文件复制
gulp.task('assets', () => {
    let img = filter(['./src/assets/imgs/**'], {
        restore: true
    });

    return gulp.src(['./src/assets/**', '!./src/assets/scss', '!./src/assets/scss/**'])
        // .pipe(img)
        // .pipe($.imagemin())
        // .pipe(img.restore)
        .pipe(gulp.dest('./dist/assets'));
});

gulp.task('assets:watch', () => {
    gulp.watch('./src/assets/**', ['assets']);
});

// 样式
gulp.task('styles', () => {
    return gulp.src(['./src/**/*.{scss,wxss}'])
        .pipe($.sass())
        .pipe($.postcss([
            autoprefixer([
                'iOS >= 3',
                'Android >= 4.1'
            ])
        ]))
        .pipe($.if(prod, $.cssnano()))
        .pipe($.rename((path) => path.extname = '.wxss'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('styles:watch', () => {
    gulp.watch('./src/**/*.{scss,wxss}', ['styles'])
});

// 脚本
gulp.task('scripts', () => {
    return gulp.src('./src/**/*.js')
        // .pipe($.babel())
        // .pipe($.if(prod, $.uglify()))
        .pipe(gulp.dest('./dist'));
})

gulp.task('scripts:watch', () => {
    gulp.watch('./src/**/*.js', ['scripts']);
});

gulp.task('build', [
    'json',
    'templates',
    'styles',
    'scripts',
    'assets',
]);

gulp.task('watch', [
    'json:watch',
    'assets:watch',
    'templates:watch',
    'styles:watch',
    'scripts:watch'
]);

gulp.task('build:clean', (callback) => {
    runSequence('clean', 'build', callback);
});

gulp.task('watch:clean', (callback) => {
    runSequence('build:clean', 'watch', callback);
});

gulp.task('build:prod', (callback) => {
    prod = true;

    runSequence('build:clean', callback);
});

gulp.task('default', ['watch:clean']);
