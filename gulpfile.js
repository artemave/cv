var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var sugarss = require('sugarss');
var { exec } = require('child_process');

var $ = gulpLoadPlugins();

var paths = {
  resume: 'src/resume.json',
  styles: 'src/styles/**/*.sss'
};

function sortRules() {
  return gulp.src(paths.styles)
    .pipe($.postcss([
      require('postcss-sorting')({
        'empty-lines-between-children-rules': 1
      })
    ], { syntax: sugarss }))
    .pipe(gulp.dest('src/styles'));
}

function styles() {
  return gulp.src('src/styles/style.sss')
    .pipe($.postcss([
      require('postcss-import'),
      require('postcss-nested'),
      require('postcss-custom-properties'),
      require('postcss-custom-media'),
      require('postcss-short-size'),
      require('autoprefixer'),
      require('postcss-reporter')({
        clearMessages: true
      })
    ], { parser: sugarss }))
    .pipe($.rename('style.css'))
    .pipe(gulp.dest('public'))
    .pipe($.cssnano())
    .pipe($.rename('style.min.css'))
    .pipe(gulp.dest('public'));
}

function buildHtml(cb) {
  exec('npx resume export public/index.html --resume src/resume.json --theme .', function (err, stdout, stderr) {
    if (err) {
      console.error('Error while exporting resume:', err);
      console.error(stderr);
    }
    cb(err);
  });
}

function buildPdf() {
  return gulp.src('public/index.html')
    .pipe($.htmlPdf({
      base: 'file:///Users/alec/projects/personal/cv/public/',
      border: {
        top: '2cm',
        right: '1cm',
        bottom: '2cm',
        left: '1cm'
      },
    }))
    .pipe($.rename('alec-rust-cv.pdf'))
    .pipe(gulp.dest('public'));
}

function minifyHtml() {
  return gulp.src('public/index.html')
    .pipe($.htmlMinifier({
      caseSensitive: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      minifyJS: true,
      removeAttributeQuotes: true,
      removeComments: true,
      removeOptionalTags: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    }))
    .pipe(gulp.dest('public'));
}

function copyJson() {
  return gulp.src(paths.resume)
    .pipe($.rename('alec-rust-cv.json'))
    .pipe(gulp.dest('public'));
}

function watch() {
  gulp.watch(paths.resume, copyJson);
  gulp.watch(paths.styles, styles);
}

gulp.task('sort-rules', sortRules);
gulp.task('styles', gulp.series(sortRules, styles));
gulp.task('build-html', buildHtml);
gulp.task('build-pdf', buildPdf);
gulp.task('minify-html', minifyHtml);
gulp.task('copy-json', copyJson);
gulp.task('build', gulp.series('styles', 'copy-json', 'build-html', 'build-pdf', 'minify-html'));
gulp.task('watch', gulp.series('styles', watch));
gulp.task('default', gulp.series('build'));
