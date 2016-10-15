import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import sugarss from 'sugarss';
import Pageres from 'pageres';

const $ = gulpLoadPlugins();

var paths = {
  resume: 'src/resume.json',
  styles: 'src/styles/**/*.sss'
};

gulp.task('styles', ['sort-rules'], () => {
  return gulp.src('src/styles/style.sss')
    .pipe($.postcss([
      require('postcss-import'),
      require('postcss-nested'),
      require('postcss-custom-properties'),
      require('postcss-custom-media'),
      require('postcss-short-size'),
      require('postcss-normalize'),
      require('autoprefixer'),
      require('postcss-reporter')({
        clearMessages: true
      })
    ], { parser: sugarss }))
    .pipe($.rename('style.css'))
    .pipe(gulp.dest('public'))
    .pipe($.cssnano())
    .pipe($.rename('style.min.css'))
    .pipe(gulp.dest('public'))
});

gulp.task('sort-rules', () => {
  return gulp.src(paths.styles)
    .pipe($.postcss([
      require('postcss-sorting')({
        'empty-lines-between-children-rules': 1
      })
    ], { syntax: sugarss }))
    .pipe(gulp.dest('src/styles'));
});

gulp.task('build-pdf', () => {
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
});

gulp.task('build-screenshot', () => {
  return new Pageres({
      filename: 'screenshot'
    })
    .src('public/index.html', ['1280x850'], {crop: true})
    .dest('public')
    .run();
});

gulp.task('minify-html', () => {
  gulp.src('public/index.html')
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
    .pipe(gulp.dest('public'))
});

gulp.task('copy-json', () => {
  return gulp.src(paths.resume)
    .pipe($.rename('alec-rust-cv.json'))
    .pipe(gulp.dest('public'));
});

gulp.task('deploy', ['build'], () => {
  return gulp.src('./public/**/*')
    .pipe($.ghPages({
      force: true
    }));
});

gulp.task('watch', ['styles'], () => {
  gulp.watch(paths.resume, ['copy-json']);
  gulp.watch(paths.styles, ['styles']);
});

gulp.task('build', ['styles', 'copy-json', 'build-pdf', 'build-screenshot', 'minify-html']);
gulp.task('default', ['build']);
