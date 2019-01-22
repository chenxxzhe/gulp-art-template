var fs = require('fs')
var should = require('should')
var path = require('path')
require('mocha')

var gutil = require('gulp-util')
var template = require('../');


function compare(stream, compareFile, done) {
    stream.on('error', function(err) {
        should.exist(err)
        done(err)
    })
    stream.on('data', function(newFile) {
        should.exist(newFile)
        should.exist(newFile.contents)
        String(newFile.contents).should.equal(String(compareFile.contents))
        done()
    })
}

describe('gulp-art-template', function() {
    var expectedDataFile = new gutil.File({
        path: path.join(__dirname, 'expected', 'data.html'),
        cwd: __dirname,
        base: path.join(__dirname, 'expected'),
        contents: fs.readFileSync(path.join(__dirname, 'expected', 'data.html'))
    });

    var expectedExtendedFile = new gutil.File({
        path: path.join(__dirname, 'expected', 'sub.html'),
        cwd: __dirname,
        base: path.join(__dirname, 'expected'),
        contents: fs.readFileSync(path.join(__dirname, 'expected', 'sub.html'))
    });

    it('Test render datas', function(done) {
        var srcFile = new gutil.File({
            path: path.join(__dirname, 'templates', 'data.art'),
            cwd: __dirname,
            base: path.join(__dirname, 'templates'),
            contents: fs.readFileSync(path.join(__dirname, 'templates', 'data.art'))
        })

        var stream = template({ title: 'gulp-art-template' });


        compare(stream, expectedDataFile, done);


        stream.write(srcFile)

        stream.end()
    });

    it('Test extend data', function(done) {
        var srcFile = new gutil.File({
            path: path.join(__dirname, 'templates', 'sub.art'),
            cwd: __dirname,
            base: path.join(__dirname, 'templates'),
            contents: fs.readFileSync(path.join(__dirname, 'templates', 'sub.art'))
        })

        var stream = template()

        compare(stream, expectedExtendedFile, done)

        stream.write(srcFile)

        stream.end()
    })

    it('Test include template', function(done) {
        var srcFile = new gutil.File({
            path: path.join(__dirname, 'templates', 'include.art'),
            cwd: __dirname,
            base: path.join(__dirname, 'templates'),
            contents: fs.readFileSync(path.join(__dirname, 'templates', 'include.art'))
        })

        var stream = template({ title: 'gulp-art-template' });

        compare(stream, expectedDataFile, done);

        stream.write(srcFile)

        stream.end()
    });

    it('Test config ext', function() {
        var srcFile = new gutil.File({
            path: path.join(__dirname, 'templates', 'include.art'),
            cwd: __dirname,
            base: path.join(__dirname, 'templates'),
            contents: fs.readFileSync(path.join(__dirname, 'templates', 'include.art'))
        })

        var stream = template({ title: 'gulp-art-template' }, {}, {
            ext: '.html'
        });


        stream.write(srcFile)
        String(path.extname(srcFile.path)).should.equal('.html');
        stream.end()
    });
})