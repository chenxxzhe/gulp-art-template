# gulp-art-template4
A plugin for Gulp that parses art-template template files


## install

```
npm i gulp-art-template4 -D
```

## gulpfile.js

```
var template = require("gulp-art-template4")

gulp.src("./templates/*.art")
	.pipe(template({
		msg: "Hello Gulp!"
	}))
	.pipe(gulp.dest("./dist"))
```