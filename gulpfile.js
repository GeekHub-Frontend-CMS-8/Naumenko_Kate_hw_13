var gulp         = require('gulp');
var sass         = require('gulp-sass');
var browserSync  = require('browser-sync');
var imagemin     = require('gulp-imagemin');
var pngquant     = require('imagemin-pngquant');
var cache        = require('gulp-cache');
var autoprefixer = require('gulp-autoprefixer');
var del          = require('del');
var babel        = require('gulp-babel');

gulp.task('sass', function () {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 2 versions', 'ie 10', 'ie 9'], {cascade: true}))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('clean', function () {
    del.sync(['./dist']);
});

gulp.task('img', function () {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('clear', function() {
    return cache.clearAll();
});

gulp.task('font', function () {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('html', function () {
    return gulp.src('app/**/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'dist'
        },
        notify: false,
        ui: {
            port: 3000
        }
    });
});

gulp.task('js', function () {

    return gulp.src([
        'node_modules/shufflejs/dist/shuffle.min.js',
        'app/js/**/*.js'
        ])
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', [ 'clean', 'browser-sync', 'sass', 'font', 'html', 'js', 'img'], function () {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/**/*.html' , ['html'], browserSync.reload);
    gulp.watch('app/img/**/*', ['img'], browserSync.reload);
    gulp.watch('app/js/**/*.js', ['js']);
});