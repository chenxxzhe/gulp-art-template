const gulp = require('gulp')
const art = require('../index')

const setting = {
  ext: '.html',
  // 小程序要替换 标准语法
  standardRule: /{{%([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*%}}/
}

gulp.task('include', function() {
  return gulp.src("./templates/include.art")
    .pipe(art({
      title: 'test-include'
    }, {
      debug: true
    }))
    .pipe(gulp.dest('./expected'))
})

gulp.task('sub', function() {
  return gulp.src('./templates/*sub.art')
    .pipe(art({}, {
      debug: true
    }, setting))
    .pipe(gulp.dest('./expected'))
})

gulp.task('default', gulp.series('include', 'sub'))

exports.customSetting = setting