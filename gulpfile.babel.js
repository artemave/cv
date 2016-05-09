import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';

const $ = gulpLoadPlugins();

gulp.task('deploy', () => {
  return gulp.src('./public/**/*')
    .pipe($.ghPages({
      force: true
    }));
});
