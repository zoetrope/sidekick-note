var gulp = require("gulp");
var bower = require("gulp-bower-files");
var flatten = require("gulp-flatten");
var typescript = require('gulp-tsc');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var cond = require('gulp-if');
var gutil = require('gulp-util');

var appConfig = {
    app: {
        typescripts: 'scripts/**/*.ts',
        stylesheets: 'stylesheets/*.css',
        views: 'scripts/**/*.html',
        images: 'images'
    },
    typings: 'typings',
    dist_dir: 'public',
    dist: {
        scripts: 'public/scripts',
        stylesheets: 'public/stylesheets',
        views: 'public/views',
        images: 'public/images',
        fonts: 'public/fonts'
    }
};

isRelease = gutil.env.release;

gulp.task('load', function () {
    return bower();
});

gulp.task("bower", ['clean', 'load'], function () {
    var bower_dir = 'bower_components/';
    var jsFiles = [
        'jquery/dist/jquery.js',
        'jquery-ui/ui/jquery.ui.core.js',
        'jquery-ui/ui/jquery.ui.datepicker.js',
        'angular/angular.js',
        'angular-resource/angular-resource.js',
        'angular-route/angular-route.js',
        'angular-ui-utils/ui-utils.js',
        'angular-ui/build/angular-ui.js',
        'angular-ui-select2/src/select2.js',
        'angular-ui-date/src/date.js',
        'angular-ui-bootstrap-bower/ui-bootstrap-tpls.js',
        'select2/select2.min.js',
        'bootstrap/dist/js/bootstrap.js',
        'highlightjs/highlight.pack.js',
        'marked/lib/marked.js',
        'momentjs/moment.js',
        'momentjs/lang/ja.js',
        'rxjs/rx.js',
        'rxjs/rx.async.js',
        'reactiveproperty-angular/reactiveproperty-angular.js'
    ];
    var cssFiles = [
        'angular-ui/build/angular-ui.css',
        'bootstrap/dist/css/bootstrap.css',
        'bootstrap/dist/css/bootstrap-theme.css',
        'highlightjs/styles/default.css',
        'jquery-ui/themes/smoothness/jquery-ui.css',
        'select2/select2.css',
        'select2/select2-spinner.gif',
        'select2/select2.png',
        'select2/select2x2.png'
    ];
    var fontFiles = [
        'bootstrap/dist/fonts/*.*'
    ];
    var imageFiles = [
        'jquery-ui/themes/smoothness/images/*.*'
    ];

    gulp.src(jsFiles.map(function (jsFile) {
        return bower_dir + jsFile
    }))
        .pipe(cond(isRelease, uglify({preserveComments: 'some'})))
        .pipe(flatten())
        .pipe(gulp.dest(appConfig.dist.scripts));

    gulp.src(cssFiles.map(function (cssFile) {
        return bower_dir + cssFile
    }))
        .pipe(flatten())
        .pipe(gulp.dest(appConfig.dist.stylesheets));

    gulp.src(fontFiles.map(function (fontFile) {
        return bower_dir + fontFile
    }))
        .pipe(flatten())
        .pipe(gulp.dest(appConfig.dist.fonts));

    gulp.src(imageFiles.map(function (imageFile) {
        return bower_dir + imageFile
    }))
        .pipe(flatten())
        .pipe(gulp.dest(appConfig.dist.images));
});

gulp.task('compile', function () {
    gulp.src(appConfig.app.typescripts)
        .pipe(typescript({out: 'App.js', emitError: false}))
        .pipe(gulp.dest(appConfig.dist.scripts));
});

gulp.task('copy-tsd', function () {
    gulp.src('bower_components/rxjs/ts/*.ts')
        .pipe(gulp.dest(appConfig.typings + "/rxjs/"));
    gulp.src('bower_components/reactiveproperty-angular/typescript/*.d.ts')
        .pipe(gulp.dest(appConfig.typings + "/reactiveproperty-angular/"));
});
gulp.task('copy-views', function () {
    gulp.src(appConfig.app.views)
        .pipe(flatten())
        .pipe(gulp.dest(appConfig.dist.views));
});
gulp.task('copy-css', function () {
    gulp.src(appConfig.app.stylesheets)
        .pipe(gulp.dest(appConfig.dist.stylesheets));
});
gulp.task('copy', ['copy-views', 'copy-css']);

gulp.task('clean', function () {
    gulp.src(appConfig.dist_dir + '/**/*', {read: false})
        .pipe(clean());
});

gulp.task('watch', ['compile', 'copy'], function () {
    gulp.watch(appConfig.app.typescripts, ['compile']);
    gulp.watch(appConfig.app.views, ['copy-views']);
});

gulp.task('default', ['clean', 'bower', 'copy', 'compile']);

gulp.task('server', ['watch'], function () {
    var connect = require('gulp-connect');
    connect.server({
        root: ['dist'],
        port: 9001,
        livereload: true
    });
});