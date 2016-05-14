import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import sugarss from 'sugarss';
import sorting from 'postcss-sorting';

const $ = gulpLoadPlugins();

var paths = {
  styles: 'src/css/*.sss'
};

gulp.task('styles', ['sort-rules'], () => {
  return gulp.src(paths.styles)
    .pipe($.postcss([
      require('autoprefixer'),
      require('postcss-import')
    ], { parser: sugarss }))
    .pipe($.rename('style.css'))
    .pipe(gulp.dest('.'));
});

gulp.task('sort-rules', () => {
  return gulp.src(paths.styles)
    .pipe($.postcss([
      sorting({
        'empty-lines-between-children-rules': 1
      })
    ], { syntax: sugarss }))
    .pipe(gulp.dest('src/css'));
});

gulp.task('deploy', () => {
  return gulp.src('./public/**/*')
    .pipe($.ghPages({
      force: true
    }));
});

gulp.task('watch', () => {
  gulp.watch(paths.styles, ['styles']);
});
