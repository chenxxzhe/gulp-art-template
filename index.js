var through = require('through2');
var gutil = require('gulp-util');
var template = require('art-template');
var assign = require('object-assign');


var PLUGIN_NAME = 'gulp-arttemplate'

var extendDataReg = /extend\(.*,\s*(\{.*\})\s*\)/


/**
 * 获取 extend 语句的 data
 *
 * @param {string} expression
 * @return {object}
 */
function getExtendData(expression) {
    if (!expression) return null
    try {
        var matcher = expression.match(extendDataReg)
        if (matcher && matcher[1]) {
            return JSON.parse(matcher[1])
        }
    } catch(err) {
        console.log(err)
        throw new gutil.PluginError(PLUGIN_NAME, 'get extend data error: invalid JSON')
    }
}

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
    var rules = template.defaults.rules
    rules[0].test = settings.originRule || rules[0].test
    rules[1].test = settings.standardRule || rules[1].test

    var isDebug = options.debug

    return through.obj(function(file, enc, cb) {
        if(file.isNull()) {
            this.push(file);
            return cb();
        }

        if(file.isStream()) {
            this.emit(
                'error',
                new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported')
            );
        }

        data = assign({}, data, file.data);
        options.filename = file.path;

        // extend 可以接收第二个参数作为 data
        var contents = String(file.contents)
        var i = 0
        for (;i<2;i++) {
            var reg = new RegExp(rules[i].test)
            var matcher = contents.match(reg)
            if (matcher && matcher[3]) {
                if (isDebug) console.log('extend expression:', matcher[3])
                var extendData = getExtendData(matcher[3])
                if (extendData) { 
                    data = assign({}, data, extendData)
                    break
                }
            }
        }
        if (isDebug) console.log('render data', JSON.stringify(data))
        try {
            file.contents = Buffer.from(
                template.render(contents, data, options)
            );
            if(typeof settings.ext !== 'undefined') {
                file.path = gutil.replaceExtension(file.path, settings.ext);
            }
        } catch(err) {
            console.log(err)
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, err.toString()))
        }

        this.push(file);
        cb();
    });
};