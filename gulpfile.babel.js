import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import sugarss from 'sugarss';

const $ = gulpLoadPlugins();

var paths = {
  resume: 'src/resume.json',
  styles: 'src/css/*.sss'
};

gulp.task('styles', ['sort-rules'], () => {
  return gulp.src('src/css/style.sss')
    .pipe($.postcss([
      require('postcss-import'),
      require('postcss-custom-properties'),
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
    .pipe(gulp.dest('src/css'));
});

gulp.task('build-pdf', () => {
  return gulp.src('public/index.html')
    .pipe($.htmlPdf({
      base: 'file:///Users/alec/projects/personal/cv/public/'
    }))
    .pipe($.rename('alec-rust-cv.pdf'))
    .pipe(gulp.dest('public'));
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

gulp.task('build', ['styles', 'build-pdf', 'copy-json']);
gulp.task('default', ['build']);
