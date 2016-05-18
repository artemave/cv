import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import sugarss from 'sugarss';

const $ = gulpLoadPlugins();

var paths = {
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
    .pipe(gulp.dest('.'));
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

gulp.task('pdf', () => {
  return gulp.src('public/index.html')
    .pipe($.html2pdf({
      printMediaType: true
    }))
    .pipe($.rename('Alec Rust CV.pdf'))
    .pipe(gulp.dest('public'));
});

gulp.task('deploy', () => {
  return gulp.src('./public/**/*')
    .pipe($.ghPages({
      force: true
    }));
});

gulp.task('watch', ['styles'], () => {
  gulp.watch(paths.styles, ['styles']);
});

gulp.task('build', ['styles']);
gulp.task('default', ['build']);
