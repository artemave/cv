import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import sugarss from 'sugarss';

const $ = gulpLoadPlugins();

var paths = {
  resume: 'src/resume.json',
  styles: 'src/css/*.sss'
};

gulp.task('styles', ['sort-rules'], () => {
  return gulp.src(paths.styles)
    .pipe($.postcss([
      require('postcss-import'),
      require('postcss-normalize'),
      require('autoprefixer')
    ], { parser: sugarss }))
    .pipe($.rename('style.css'))
    .pipe(gulp.dest('public'));
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
    .pipe($.html2pdf({
      printMediaType: true
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
