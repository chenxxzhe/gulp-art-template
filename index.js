var through = require('through2');
var gutil = require('gulp-util');
var template = require('art-template');
var assign = require('object-assign');
var Buffer = require('safe-buffer').Buffer;


module.exports = function(data, options, settings) {
    data = data || {};
    options = assign({
        minimize: false,
        cache: false,
        include: function(filename, includeData, includeBlock, includeOptions) {
            includeData = assign({}, includeData, data);
            return template.defaults.include(filename, includeData, includeBlock, includeOptions);
        }
    }, options);
    settings = settings || {};
    return through.obj(function(file, enc, cb) {
        if(file.isNull()) {
            this.push(file);
            return cb();
        }

        if(file.isStream()) {
            this.emit(
                'error',
                new gutil.PluginError('gulp-ejs', 'Streaming not supported')
            );
        }

        data = assign({}, data, file.data);
        options.filename = file.path;
        try {
            file.contents = new Buffer(
                template.render(String(file.contents), data, options)
            );
            if(typeof settings.ext !== 'undefined') {
                file.path = gutil.replaceExtension(file.path, settings.ext);
            }
        } catch(err) {
            console.log(err)
            this.emit('error', new gutil.PluginError('gulp-art-template', err.toString()))
        }

        this.push(file);
        cb();
    });
};