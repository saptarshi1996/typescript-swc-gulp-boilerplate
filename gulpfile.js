const fs = require('fs')
const fsExtra = require('fs-extra')
const gulp = require('gulp')
const swc = require('gulp-swc')
const terser = require('gulp-terser')
const nodemon = require('gulp-nodemon')

const swcOptions = {
  jsc: {
    target: 'es5'
  },
  module: {
    type: 'commonjs',
  },
}

const clear = function () {
  return fsExtra.remove('dist')
}

const generatePackageJson = function () {
  const packageJson = {
    'type': 'commonjs'
  }
  fs.writeFileSync('dist/package.json', JSON.stringify(packageJson, null, 2))
  return Promise.resolve()
}

const buildProject = function () {
  return gulp.src('src/**/*.ts')
    .pipe(swc(swcOptions))
    .pipe(terser({
      mangle: true,
      compress: {
        unused: true,
      },
    }))
    .pipe(gulp.dest('dist'))
}

const watch = function (done) {
  return nodemon({
    script: 'src/index.ts',
    watch: 'src/',
    ext: 'ts',
    delay: 1000
  }).on('exit', function () { done() })
}

exports.build = gulp.series([clear, buildProject, generatePackageJson])
exports.watch = watch
