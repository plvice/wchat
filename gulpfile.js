//https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js

var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var gulpSequence = require('gulp-sequence');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var closure = require('gulp-jsclosure');
var concat = require('gulp-concat');
var gulpCopy = require('gulp-copy');
var cssBase64 = require('gulp-css-base64');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var babel = require('gulp-babel');
var ncu = require('npm-check-updates');
var imagemin = require('gulp-imagemin');

// The development server (the recommended option for development)
gulp.task("default", ["webpack-dev-server"]);

// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh
gulp.task("build-dev", ["webpack:build-dev"], function() {
	gulp.watch(["app/**/*"], ["webpack:build-dev"]);
});

// Production build
gulp.task("build", ["webpack:build"]);

gulp.task("webpack:build", function(callback) {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.plugins = myConfig.plugins.concat(
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				"NODE_ENV": JSON.stringify("production")
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	);

	// run webpack
	webpack(myConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}));
		callback();
	});
});

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task("webpack:build-dev", function(callback) {
	// run webpack
	devCompiler.run(function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build-dev", err);
		gutil.log("[webpack:build-dev]", stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task("webpack-dev-server", function(callback) {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.devtool = "eval";
	myConfig.debug = true;

	// Start a webpack-dev-server
	new WebpackDevServer(webpack(myConfig), {
		publicPath: "/" + myConfig.output.publicPath,
		stats: {
			colors: true
		}
	}).listen(8080, "localhost", function(err) {
		if(err) throw new gutil.PluginError("webpack-dev-server", err);
		gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
		gulp.watch(["app/**/*"], ["webpack:build-dev"]);
	});
});


/*
    plvice 2016
    These tasks don't collaborate with React! It's independent content.
*/

var path = {
    css: {
        source: './src/css/**/*.scss',
        dest: './dist/css'
    },
    js: {
        source: './src/js/**/*.js',
        dest: './dist/js'
    },
    images: {
        source: './src/img/**/*',
        baseHelper: './src/img',
        dest: './dist/img'
    },
    svg: {
        source: './src/svg/**/*',
        baseHelper: './src/svg',
        dest: './dist/svg'
    },
    static: {
        source: './src/static/**/*.*',
        baseHelper: './src/static',
        dest: './dist/static'
    },
    templates: {
        source: './src/templates/*.hbs'
    },
	vendor: {
		dest: 'app/vendor'
	}
}

var vendor = {
	'crypto-js': [
	    'bower_components/crypto-js/core.js',
	    'bower_components/crypto-js/md5.js'
	]
};

gulp.task('vendor', function() {
	var src, filename;

	for (var prop in vendor) {
		if (vendor.hasOwnProperty(prop)) {
			src = vendor[prop];
			filename = prop + '.js';
			gulp.src(src)
			  .pipe(plumber())
			  .pipe(concat(filename))
			  .pipe(uglify())
			  .pipe(gulp.dest(path.vendor.dest));
		}
	}
});

// gulp.task('templates', function(){
//   gulp.src(path.templates.source)
//     .pipe(handlebars())
//     .pipe(wrap('Handlebars.template(<%= contents %>)'))
//     .pipe(declare({
//       namespace: 'core.templates',
//       noRedeclare: true,
//     }))
//     .pipe(concat('templates.js'))
//     .pipe(gulp.dest(path.js.dest));
// });

gulp.task('compileJs', function() {
  return gulp.src(path.js.source)
    .pipe(plumber())
    .pipe(babel({
        presets: ['es2015', 'react']
    }))
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    // .pipe(closure(['window', 'document']))
    .pipe(gulp.dest(path.js.dest));
});

gulp.task('sass', function () {
  return gulp.src(path.css.source)
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(cssBase64({
        extensionsAllowed: ['.svg'] // when svg path inside of css - replace it by base64 string
    }))
    .pipe(csso())
    .pipe(gulp.dest(path.css.dest));
});

gulp.task('autoprefixer', function () {
  return gulp.src(path.css.dest + '/*.css')
    .pipe(plumber())
    .pipe(autoprefixer({
		    browsers: ['last 2 versions', '> 1%'],
		    cascade: false
     }))
     .pipe(gulp.dest(path.css.dest));
});

gulp.task('minify', function() {
  return gulp.src(path.css.dest + '/*.css')
        .pipe(plumber())
        .pipe(csso())
        .pipe(gulp.dest(path.css.dest));
});

gulp.task('compileCss', function (cb){
    return gulpSequence('sass', 'autoprefixer', 'minify', cb);
});

gulp.task('images', function(cb) {
    gulp.src(path.images.source)
    .pipe(imagemin())
    .pipe(gulp.dest(path.images.dest));
});

gulp.task('static', function(cb) {
    gulp.src(path.static.source, {base: path.static.baseHelper})
        .pipe(gulp.dest(path.static.dest));
});

gulp.task('svg', function(cb) {
    gulp.src(path.svg.source)
    .pipe(imagemin())
    .pipe(gulp.dest(path.svg.dest));
});

gulp.task('dist', function (cb) {
    gulp.start('compileCss');
    gulp.start('compileJs');
    // gulp.start('templates');
    gulp.start('vendor');
    gulp.start('images');
    gulp.start('static');
    gulp.start('svg');
});

gulp.task('watch', function (cb) {
    watch(path.css.source, function() {
        gulp.start('compileCss');
    });
    watch(path.js.source, function() {
        gulp.start('compileJs');
    });
    // watch(path.templates.source, function() {
    //     gulp.start('templates');
    // });
    watch(path.images.source, function() {
        gulp.start('images');
    });
    watch(path.static.source, function() {
        gulp.start('static');
    });
    watch(path.svg.source, function() {
        gulp.start('svg');
    });
});

gulp.task('app', function (cb) {
	gulp.start('webpack-dev-server');
	gulp.start('watch');
});

gulp.task('checkupdates', function () {
    ncu.run({
        // Always specify the path to the package file
        packageFile: 'package.json',
        // Any command-line option can be specified here.
        // These are set by default:
        silent: true,
        jsonUpgraded: true
    }).then(function(upgraded) {
        console.log('dependencies to upgrade:', upgraded);
    });
});
