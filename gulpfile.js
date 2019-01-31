let {
    src,
    dest,
    parallel,
    series,
    task,
    watch
} = require('gulp'),

    log = require('gulplog'),

    imagemin = require('gulp-imagemin'),
    pngToJpeg = require('png-to-jpeg'),
    rename = require("gulp-rename"),

    sass = require('gulp-sass'),
    bulkSass = require('gulp-sass-bulk-import'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),

    gulpPug = require('gulp-pug'),

    globby = require('globby'),
    through = require('through2'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    globalShim = require('browserify-global-shim').configure({
        'jquery': '$',
    }),

    DIST = './dist',
    SRC = './src',
    mapsFolder = '../maps',

    path = {
        scss: {
            src: `${SRC}/scss/style.scss`,
            dest: `${DIST}/css/`
        },
        pug: {
            src: `${SRC}/pug/pages/**/*.pug`,
            dest: `${DIST}/`
        },
        js: {
            src: `${SRC}/js/**/*.js`,
            dest: `${DIST}/js/`
        }
    };

function img() {
    return src(['images/*.png'])
        .pipe(imagemin([
            pngToJpeg({
                quality: 90
            })
        ]))

        .pipe(rename(function (path) {
            path.extname = '.jpg';
        }))
        .pipe(dest('dist/img'))
}

function scss() {
    return src(path.scss.src)
        .pipe(bulkSass())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 version', '> 5%']
        }))
        .pipe(sourcemaps.write(mapsFolder))
        .pipe(dest(path.scss.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
}

function pug() {
    return src([path.pug.src, '!./src/pug/**/_*.pug'])
        .pipe(gulpPug({
            pretty: true
        })).on('error', log.error)
        .pipe(dest(path.pug.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
}

function script() {
    // gulp expects tasks to return a stream, so we create one here.
    var bundledStream = through();

    bundledStream
        // turns the output bundle stream into a stream containing
        // the normal attributes gulp plugins expect.
        .pipe(source('custom.js'))
        // the rest of the gulp task, as you would normally write it.
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        // Add gulp plugins to the pipeline here.
        // .pipe(uglify({
        //     // drop_console: true 
        // })).on('error', log.error)
        .pipe(sourcemaps.write(mapsFolder))
        .pipe(dest(path.js.dest))
        .pipe(browserSync.reload({
            stream: true
        }));

    // "globby" replaces the normal "gulp.src" as Browserify
    // creates it's own readable stream.
    globby([path.js.src, '!./src/js/helper/**']).then(function (entries) {
        // create the Browserify instance.
        var b = browserify({
                entries: entries,
                debug: true,
            })
            .transform(
                "babelify", {
                    presets: ['@babel/env']
                }
            )
            .transform({
                global: true,
            }, globalShim);

        // pipe the Browserify stream into the stream we created earlier
        // this starts our gulp pipeline.
        b.bundle()
            .pipe(bundledStream)
    }).catch(function (err) {
        // ensure any errors from globby are handled
        bundledStream.emit('error', err);
    });

    // finally, we return the stream, so gulp knows when this task is done.
    // console.log(bundledStream)
    return bundledStream;
}

function BSync() {
    // Static Server + watching scss/html/js files
    browserSync.init({
        server: {
            baseDir: DIST
        }
    });
}

function watchfile(done) {
    watch(`${SRC}/scss/**/*.scss`, scss)
    watch(`${SRC}/pug/**/*.pug`, pug)
    watch(`${SRC}/js/**/*.js`, script)
    done()
}

// exports.default = parallel(html, css, js);
exports.img = task(img);
exports.scss = task(scss);
exports.pug = task(pug);
exports.script = task(script);
exports.script = task(watchfile);
exports.sync = task('sync', BSync);
exports.watch = task('watch', series(parallel(scss, pug, script, watchfile), 'sync'));
exports.default = parallel('watch');