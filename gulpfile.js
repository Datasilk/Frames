'use strict';

// fetch command line arguments
const arg = (argList => {

    let arg = {}, a, opt, thisOpt, curOpt;
    for (a = 0; a < argList.length; a++) {

        thisOpt = argList[a].trim();
        opt = thisOpt.replace(/^\-+/, '');

        if (opt === thisOpt) {

            // argument value
            if (curOpt) arg[curOpt] = opt;
            curOpt = null;

        }
        else {

            // argument name
            curOpt = opt;
            arg[curOpt] = true;

        }

    }

    return arg;

})(process.argv);

//includes
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleancss = require('gulp-clean-css'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    merge = require('merge-stream'),
    changed = require('gulp-changed'),
    config = require('./App/config.json');

//get config variables from config.json
var environment = config.environment;

//determine environment
var prod = false;
if (environment != 'dev' && environment != 'development' && environment != null) {
    //using staging or production environment
    prod = true;
}

//paths
var paths = {
    scripts: './App/Scripts/',
    css: './App/CSS/',
    app: './App/',
    themes: './App/Content/themes/',
    vendor: {
        root: './App/Vendor/**/'
    },
    webroot: './App/wwwroot/',
};

//working paths
paths.working = {
    js: {
        platform: [
            paths.scripts + 'selector/selector.js',
            //paths.scripts + 'utility/velocity.min.js',
            paths.scripts + 'platform/_super.js', // <---- Datasilk Core Js: S object
            paths.scripts + 'platform/ajax.js', //   <---- Optional platform features
            //paths.scripts + 'platform/loader.js',
            paths.scripts + 'platform/message.js',
            //paths.scripts + 'platform/polyfill.js',
            //paths.scripts + 'platform/popup.js',
            //paths.scripts + 'platform/scaffold.js',
            paths.scripts + 'platform/svg.js',
            //paths.scripts + 'platform/util.js',
            //paths.scripts + 'platform/util.color.js',
            //paths.scripts + 'platform/util.file.js',
            //paths.scripts + 'platform/validate.js',
            paths.scripts + 'platform/window.js', //  <---- End of Optional features
            paths.app + 'Pages/Frames/frames.js',
        ],
        app: paths.app + '**/*.js',
        utility: [
            paths.scripts + 'utility/*.*',
            paths.scripts + 'utility/**/*.*'
        ]
    },

    less: {
        website: paths.css + 'website.less'
    },

    exclude: {
        app: [
            '!' + paths.app + 'Pages/Frames/*.*',
            '!' + paths.app + 'chrome.js',
            '!' + paths.app + 'wwwroot/**/',
            '!' + paths.app + 'Content/**/',
            '!' + paths.app + 'CSS/**/',
            '!' + paths.app + 'CSS/',
            '!' + paths.app + 'Scripts/**/'
        ]
    }
};

//compiled paths
paths.compiled = {
    platform: paths.webroot + 'js/platform.js',
    js: paths.webroot + 'js/',
    css: paths.webroot + 'css/',
};

//tasks for compiling javascript //////////////////////////////////////////////////////////////
gulp.task('js:app', function () {
    var pathlist = paths.working.exclude.app.slice(0);
    pathlist.unshift(paths.working.js.app);
    var p = gulp.src(pathlist)
        .pipe(rename(function (path) {
            path.dirname = path.dirname.toLowerCase();
            path.basename = path.basename.toLowerCase();
            path.extname = path.extname.toLowerCase();
        }));

    if (prod == true) { p = p.pipe(uglify()); }
    return p.pipe(gulp.dest(paths.compiled.js, { overwrite: true }));
});

gulp.task('js:platform', function () {
    var p = gulp.src(paths.working.js.platform, { base: '.' })
        .pipe(concat(paths.compiled.platform));
    if (prod == true) { p = p.pipe(uglify()); }
    return p.pipe(gulp.dest('.', { overwrite: true }));
});

gulp.task('js', function () {
    gulp.start('js:app');
    gulp.start('js:platform');
});

//tasks for compiling LESS & CSS /////////////////////////////////////////////////////////////////////
gulp.task('less:website', function () {
    var p = gulp.src(paths.working.less.website)
        .pipe(less());
    if (prod == true) { p = p.pipe(cleancss({ compatibility: 'ie8' })); }
    return p.pipe(gulp.dest(paths.compiled.css, { overwrite: true }));
});

gulp.task('less', function () {
    gulp.start('less:website');
});

//default task
gulp.task('default', ['js', 'less']);

//watch task
gulp.task('watch', function () {
    //watch platform JS
    gulp.watch(paths.working.js.platform, ['js:platform']);

    //watch app JS
    var pathjs = paths.working.exclude.app.slice(0);
    for (var x = 0; x < pathjs.length; x++) {
        pathjs[x] += '*.js';
    }
    pathjs.unshift(paths.working.js.app);
    gulp.watch(pathjs, ['js:app']);

    //watch website LESS
    gulp.watch([
        [
            paths.working.less.website,
            paths.app + 'Pages/Frames/frames.less'
        ]
    ], ['less:website']);
});