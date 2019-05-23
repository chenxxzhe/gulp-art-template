var through = require('through2');
var gutil = require('gulp-util');
var template = require('art-template');
var assign = require('object-assign');


var PLUGIN_NAME = 'gulp-arttemplate'

// 原始语法 解析 extend data
var extendDataReg = /extend\(.*,\s*(\{.*\})\s*\)/
// 标准语法 解析 extend data
var standardExtendDataReg = /extend.*\s*(\{.*\})\s*/


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
        var matcherStandard = expression.match(standardExtendDataReg)
        if (matcher && matcher[1]) {
            return JSON.parse(matcher[1])
        } else if (matcherStandard && matcherStandard[1]) {
            return JSON.parse(matcherStandard[1])
        }
    } catch(err) {
        console.log(err)
        throw new gutil.PluginError(PLUGIN_NAME, 'get extend data error: invalid JSON')
    }
}

module.exports = function(rawData, options, settings) {
    let data = Object.assign({}, rawData || {})
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
    const oldOriginRule = rules[0].test
    const oldStandardRule = rules[1].test
    // 注意要恢复原来的，不然会影响后续
    const overrideRule = () => {
        rules[0].test = settings.originRule || oldOriginRule
        rules[1].test = settings.standardRule || oldStandardRule
    }
    const resetRule = () => {
        rules[0].test = oldOriginRule
        rules[1].test = oldStandardRule
    }

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

        let dataClone = assign({}, data, file.data);
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
                    dataClone = assign({}, dataClone, extendData)
                    break
                }
            }
        }
        if (isDebug) console.log('render data', JSON.stringify(dataClone))
        overrideRule()
        try {
            file.contents = Buffer.from(
                template.render(contents, dataClone, options)
            );
            file.path = gutil.replaceExtension(file.path, settings.ext || '.html');
        } catch(err) {
            console.log(err)
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, err.toString()))
        } finally {
            resetRule()
        }

        this.push(file);
        cb();
    });
};