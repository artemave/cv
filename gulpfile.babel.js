import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import sugarss from 'sugarss';

const $ = gulpLoadPlugins();

gulp.task('css', () => {
  return gulp.src('src/css/style.sss')
    .pipe($.postcss([
      require('autoprefixer')
    ], { parser: sugarss }))
    .pipe($.rename('style.css'))
    .pipe(gulp.dest('.'));
});

gulp.task('deploy', () => {
  return gulp.src('./public/**/*')
    .pipe($.ghPages({
      force: true
    }));
});
