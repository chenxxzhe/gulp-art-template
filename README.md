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

## API

```
tempalte(data,options,settings)
```

#### data

Type: Object Default: {}

#### options

Type: Object Default: {}

> https://aui.github.io/art-template/docs/options.html

#### settings

Type: Object Default: {}

A object to configure the plugin.

```
{
	ext:String // Defines the file extension that will be appended to the filename. If no extension is provided, the same extension of the input file will be used.
}
```

## Change Log

**1.0.1**

- Disable default `cache` of art-template;
- Overwrite `include` method of art-template , extend global `data`;
