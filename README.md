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
	},{
		extname:'.art' // some art-template options
	},{
		ext:'.html'
	}))
	.pipe(gulp.dest("./dist"))
```

## Change Log

**1.0.1**

- Disable default `cache` of art-template;
- Overwrite `include` method of art-template , extend global `data`;
