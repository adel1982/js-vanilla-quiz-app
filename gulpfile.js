// 01 - Développement => gulp watch
// 02 - Minification de votre fichier JS => gulp miniJs
// 03 - Pour préparer votre build => gulp build

const gulp 					= require('gulp'),
			sass 					= require('gulp-sass'),
			autoprefixer 	= require('autoprefixer'),
			postcss 			= require('gulp-postcss'), 	 
			uglify 				= require('gulp-uglify'),
			imagemin 			= require('gulp-imagemin'),
			sourcemaps 		= require('gulp-sourcemaps'),
			del 					= require('del'),
			browserSync		= require('browser-sync').create();

// Files path - Src
const scssFiles    = 'scss/**/*.scss',
			htmlPhpFiles = '*.html',
			imgFiles     = 'img/**/*.+(png|jpg|gif|svg|jpeg)';

// Files path - Dist
const dist	= 'dist/';

// Parsing scss -> gulp scss
function scss() {
	return gulp.src(scssFiles)
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(postcss([autoprefixer('> 1%', 'last 2 versions')]))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('css/'))
		.pipe(browserSync.stream());
};

// Uglify - Minification -> gulp miniJs
function miniJs() {
	return gulp.src('js/app.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
};

// Optimize all img format - gulp imgMin
function imgMin() {
	return gulp.src(imgFiles)
		.pipe(imagemin({
			interlaced: true,
			progressive: true,
			optimizationLevel: 5,
			svgoPlugins: [{
				removeViewBox: true
			}]
		}))
		.pipe(gulp.dest('dist/img'));
};

// Copy Files HTML -> gulp copyHtmlPhp
function copyHtmlPhp() {
  return gulp.src('*.html')
    .pipe(gulp.dest('dist'));
};

// Copy Favicon -> gulp copyFavicon
function copyFavicon() {
  return gulp.src('favicon.ico')
    .pipe(gulp.dest('dist'));
};

// Copy CSS -> gulp copyCss
function copyCss() {
  return gulp.src('css/**/*.css')
    .pipe(gulp.dest('dist/css'));
};

// Copy JS -> gulp copyJs
function copyJs() {
  return gulp.src('js/*.js')
    .pipe(gulp.dest('dist/js'));
};

// Remove dist folder -> gulp deleteDist
function deleteDist() {	
	return del(dist, {force: true})
}

function watch() {
	browserSync.init({
		server: {
			baseDir: './',
		}
	});
  gulp.watch(scssFiles, scss);
  gulp.watch(htmlPhpFiles).on('change', browserSync.reload);
}

gulp.task('build', gulp.series(deleteDist, copyFavicon, copyHtmlPhp, copyCss, copyJs, imgMin));

exports.scss = scss;
exports.miniJs = miniJs;
exports.imgMin = imgMin;

exports.copyFavicon = copyFavicon;
exports.copyHtmlPhp = copyHtmlPhp;
exports.copyCss = copyCss;
exports.copyJs = copyJs;

exports.deleteDist = deleteDist;
exports.watch = watch;