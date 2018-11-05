const gulp = require("gulp");
const connect = require("gulp-connect");
const eslint = require("gulp-eslint");
const babel = require("gulp-babel");
const minify = require("gulp-minify");
const serveStatic = require("serve-static");

gulp.task("lint", function() {
  return gulp
    .src(["./src/*.js"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task("js", function() {
  gulp.src("./src/*.js").pipe(connect.reload());
});

gulp.task("connect", function() {
  connect.server({
    root: "./",
    livereload: true,
    port: 8888,
    middleware: function(connect) {
      return [
        connect().use("/bower_components", serveStatic("bower_components"))
      ];
    }
  });
});

gulp.task("watch", function() {
  gulp.watch(["./src/*.js"], ["lint", "js"]);
});

gulp.task("build", function() {
  return gulp
    .src("src/polygonize.js")
    .pipe(
      babel({
        presets: ["es2015"]
      })
    )
    .pipe(
      minify({
        ext: {
          src: ".js",
          min: ".min.js"
        }
      })
    )
    .pipe(gulp.dest("dist"));
});

gulp.task("default", ["connect", "lint", "watch"]);
