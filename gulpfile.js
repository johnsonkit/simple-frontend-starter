var browserSync   = require('browser-sync').create(),
    gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    cssnano       = require('gulp-cssnano'),
    babel         = require('gulp-babel'),
    uglify        = require('gulp-uglify'),
    data          = require('gulp-data'),
    yaml          = require('gulp-yaml'),
    merge         = require('gulp-merge-json'),
    render        = require('gulp-nunjucks-render'),
    htmlmin       = require('gulp-htmlmin'),
    notify        = require('gulp-notify'),
    fs            = require('fs'),
    del           = require('del'),
    inlinesource  = require('gulp-inline-source'),
    inlineCss     = require('gulp-inline-css'),
    changed       = require('gulp-changed'),
    imagemin      = require('gulp-imagemin');

/*
    Task Path and Config
    */
var DIR = {
    src: './app',
    dev: './build',
    dist: './dist',
    local_server: './build'  
}

var TPC = {
    yml: {
        src: `${DIR.src}/yml/*.yml`,
        dest: `${DIR.src}/html/data`,
        config: {
            merge: { "fileName": "combined.json" }
        }
    },
    style: {
        src: `${DIR.src}/stylesheet`,
        srcFull: `${DIR.src}/stylesheet/**/*.{scss,sass,css}`,
        dev: `${DIR.dev}/css`,
        dist: `${DIR.dist}/css`,
        config: {
            autoprefixer: { 
                overrideBrowserslist: ["last 2 versions"] ,
                grid: true
            },
            cssnano: { minifyFontValues: {removeAfterKeyword: false, removeQuotes: false} }
        }
    },
    script: {
        src: `${DIR.src}/javascript`,
        srcFull: `${DIR.src}/javascript/**/*.js`,
        dev: `${DIR.dev}/js`,
        dist: `${DIR.dist}/js`,
    },
    html: {
        src: `${DIR.src}/html`,
        srcFull: './app/html/*.{nunjucks,njk,html}',
        dev: DIR.dev,
        dist: DIR.dist,
        config: {
            dataJSONFile: `${DIR.src}/html/data/combined.json`,
            postProcessHTMLPath: './dist/*.html',
            htmlmin: {
                collapseWhitespace: true,
                preserveLineBreaks: false,
                removeComments: false
            }
        }
    },
    images: { 
        src: `${DIR.src}/images/**/*.{jpg,png,svg,gif}`,
        dev: `${DIR.dev}/images`,
        dist: `${DIR.dist}/images`
    },
    clean: {
        dev: `${DIR.dev}/*`,
        dist: `${DIR.dist}/*`
    }
};

/*
    Error handling
  */
 function handleErrors(errorObject, callback) {
    notify.onError(errorObject.toString()).apply(this, arguments);
}

/*
    Development Server
    */
function server() {
    browserSync.init({
        server: {
            baseDir: DIR.local_server
        }
    })
}

/*
    Reload browser
    */
function reload(done) {
    browserSync.reload();
    done();
}

/*
    YML to json data
    */
function yml() {
    return gulp
            .src(TPC.yml.src)
            .pipe(yaml())
            .on('error', handleErrors)
            .pipe(merge(TPC.yml.config.merge))
            .pipe(gulp.dest(TPC.yml.dest))
}

function getData() {
    return JSON.parse(fs.readFileSync(TPC.html.config.dataJSONFile, 'utf8'))
}

/*
    Templating
    */
function html_dev() {
    return gulp
            .src(TPC.html.srcFull)
            .pipe(changed(TPC.html.dev, {extension: '.html'} ))
            .pipe(data(getData))
            .on('error', handleErrors)
            .pipe(render({ path: [TPC.html.src] }))
            .on('error', handleErrors)
            .pipe(gulp.dest(TPC.html.dev))
}

function html_dist() {
    return gulp
            .src(TPC.html.srcFull)
            .pipe(data(getData))
            .on('error', handleErrors)
            .pipe(render({ path: [TPC.html.src] }))
            .on('error', handleErrors)
            .pipe(htmlmin(TPC.html.config.htmlmin))
            .on('error', handleErrors)
            .pipe(gulp.dest(TPC.html.dist))
            .on('error', handleErrors)
}

/*
    Stylesheet
    */
function style_dev() {
    return gulp
            .src(TPC.style.srcFull)
            .pipe(changed(TPC.style.dev, {extension: '.css'} )) 
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer(TPC.style.config.autoprefixer))
            .pipe(gulp.dest(TPC.style.dev))       
}

function style_dist() {
    return gulp
            .src(TPC.style.srcFull)
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer(TPC.style.config.autoprefixer))
            .pipe(cssnano(TPC.style.config.cssnano))
            .pipe(gulp.dest(TPC.style.dist))
}

/*
    Javascript
    */
function script_dev() {
    return gulp
            .src(TPC.script.srcFull)
            .pipe(changed(TPC.script.dev, {extension: '.js'} ))
            .pipe(babel({
                presets: ['@babel/preset-env']
            }))
            .on('error', handleErrors)
            .pipe(gulp.dest(TPC.script.dev))
}

function script_dist() {
    return gulp
            .src(TPC.script.srcFull)
            .pipe(babel({
                presets: ['@babel/preset-env']
            }))
            .on('error', handleErrors)
            .pipe(uglify())
            .pipe(gulp.dest(TPC.script.dist))
}

/*
    Image
    */
function images_dev() {
    return gulp
            .src(TPC.images.src)
            .pipe(changed(TPC.images.dev))
            .pipe(gulp.dest(TPC.images.dev))
}

function images_dist() {
    return gulp
            .src(TPC.images.src)
            .pipe(imagemin())
            .pipe(gulp.dest(TPC.images.dist))
}

/*
    Post-processing HTML
    */
function injectInlineCSSandJS() {
    return gulp 
            .src(TPC.html.config.postProcessHTMLPath)
            .pipe(inlinesource({
                compress: true
            }))
            .pipe(gulp.dest(DIR.dist))
}

function inlinecss() {
    return gulp
            .src(TPC.html.config.postProcessHTMLPath)
            .pipe(inlineCss())
            .on('error', handleErrors)
            .pipe(gulp.dest(DIR.dist))
}

/*
    Cleaning
    */
function clean_dev() {
    return del([TPC.clean.dev])
}

function clean_dist() {
    return del([TPC.clean.dist])
}

/*
    Watching files changed
    */
function watch() {
    gulp.watch(TPC.yml.src, yml);
    gulp.watch(TPC.html.srcFull, html_dev);
    gulp.watch(TPC.style.srcFull, style_dev);
    gulp.watch(TPC.script.srcFull, script_dev);
    gulp.watch(TPC.images.src, images_dev);
    gulp.watch(DIR.dev, reload);
}

/*
    Task
    */
gulp.task(
    'default', 
    gulp.series(
        clean_dev, 
        gulp.parallel(yml, style_dev, script_dev, images_dev), 
        html_dev,
        gulp.parallel(server, watch)
    )
);

gulp.task(
    'dist', 
    gulp.series(
        clean_dist, 
        gulp.parallel(yml, style_dist, script_dist, images_dist), 
        html_dist,
        injectInlineCSSandJS
    )
);

gulp.task(
    'dist:edm', 
    gulp.series(
        clean_dist, 
        gulp.parallel(yml, style_dist, script_dist, images_dist), 
        html_dist,
        inlinecss
    )
);