import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';

const $ = gulpLoadPlugins();

gulp.task('css', () => {
  return gulp.src('src/css/style.css')
    .pipe($.postcss([
      require('autoprefixer')
    ]))
    .pipe($.rename('style.css'))
    .pipe(gulp.dest('.'));
});

gulp.task('deploy', () => {
  return gulp.src('./public/**/*')
    .pipe($.ghPages({
      force: true
    }));
});
