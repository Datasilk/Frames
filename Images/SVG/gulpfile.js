var svgstore = require('./index')
var gulp = require('gulp')
var mocha = require('gulp-mocha')
var cheerio = require('gulp-cheerio')
var connect = require('connect')
var serveStatic = require('serve-static')
var http = require('http')
var inject = require('gulp-inject')
var replace = require('gulp-replace');
var rename = require('gulp-rename');


gulp.task('svg', function () {

  return gulp
    .src('../Icons/*.svg')
    .pipe(cheerio({
      run: function ($) {
        $('[fill="none"]').removeAttr('fill')
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(svgstore())
    .pipe(replace('svg"><defs>', 'svg">\n\n\n' + 
    '<style type="text/css">\n' +
    '    path:not(.svg-nocolor){fill:currentColor}\n' +
    '    use:not(.svg-nocolor):visited{color:currentColor}\n' +
    '    use:not(.svg-nocolor):hover{color:currentColor}\n' +
    '    use:not(.svg-nocolor):active{color:currentColor}\n' +
    '</style>\n\n\n' + 
    '<defs>'))
    //.pipe(gulp.dest('test/compiled'))
    .pipe(rename(function(path) {
      path.dirname = path.dirname.toLowerCase();
      path.basename = path.basename.toLowerCase();
      path.extname = path.extname.toLowerCase();
    }))
	  .pipe(gulp.dest('../../App/wwwroot/images'));
});


gulp.task('inline-svg', function () {

  function fileContents (filePath, file) {
    return file.contents.toString('utf8')
  }

  var svgs = gulp
    .src('test/icons/*.svg')
    .pipe(cheerio({
      run: function ($) {
        $('[fill="none"]').removeAttr('fill')
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(svgstore({ inlineSvg: true }))

  return gulp
    .src('test/icons/inline-svg.html')
    .pipe(inject(svgs, { transform: fileContents }))
    .pipe(gulp.dest('test/compiled'))

});


//watch task
gulp.task('watch', function () {
    //watch icons folder for SVG file changes from Flash (Animate CC)
    gulp.watch('../Icons/*.svg', ['svg']);
});
