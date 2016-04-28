import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';

const $ = gulpLoadPlugins();

gulp.task('serve', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ''
    }
  });

  gulp.watch('index.html').on('change', browserSync.reload);
  gulp.watch('resume.json', ['build']);
});

gulp.task('build', $.shell.task(
  'resume export index --theme flat --format html'
));

gulp.task('default', ['build'], () => {
  gulp.start('serve');
});
