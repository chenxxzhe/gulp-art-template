const gulp = require('gulp')
const art = require('../index')


gulp.task('default', function() {
  return gulp.src('./templates/*sub.art')
    .pipe(art({}, {
      debug: true
    }, {
      ext: '.html',
      // 小程序要替换 标准语法
      standardRule: /{{%([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*%}}/
    }))
    .pipe(gulp.dest('./expected'))
})