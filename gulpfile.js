const path = require("path");
const gulp = require("gulp");
const exec = require("child_process").exec;
const env = require("gulp-env");
const dotenv = require("dotenv");

const fs = require("fs");
const fsp = fs.promises;
const concat = require("gulp-concat");
const connect = require("gulp-connect");
const { watch } = gulp;

const {
  createExamplesPage,
} = require("./public/Potree/src/tools/create_potree_page");
const {
  createGithubPage,
} = require("./public/Potree/src/tools/create_github_page");
const {
  createIconsPage,
} = require("./public/Potree/src/tools/create_icons_page");

const mode = process.env.MODE || "dev";
const envFile = `./config/.env.${mode}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

let paths = {
  laslaz: [
    "public/build/workers/laslaz-worker.js",
    "public/build/workers/lasdecoder-worker.js",
  ],
  html: [
    "public/Potree/src/viewer/potree.css",
    "public/Potree/src/viewer/sidebar.html",
    "public/Potree/src/viewer/profile.html",
  ],
  resources: ["public/Potree/resources/**/*"],
};

let workers = {
  LASLAZWorker: [
    "public/Potree/libs/plasio/workers/laz-perf.js",
    "public/Potree/libs/plasio/workers/laz-loader-worker.js",
  ],
  LASDecoderWorker: ["public/Potree/src/workers/LASDecoderWorker.js"],
  EptLaszipDecoderWorker: [
    "public/Potree/src/workers/EptLaszipDecoderWorker.js",
  ],
  EptBinaryDecoderWorker: [
    "public/Potree/libs/ept/ParseBuffer.js",
    "public/Potree/src/workers/EptBinaryDecoderWorker.js",
  ],
  EptZstandardDecoderWorker: [
    "public/Potree/src/workers/EptZstandardDecoder_preamble.js",
    "public/Potree/libs/zstd-codec/bundle.js",
    "public/Potree/libs/ept/ParseBuffer.js",
    "public/Potree/src/workers/EptZstandardDecoderWorker.js",
  ],
};

// these libs are lazily loaded
// in order for the lazy loader to find them, independent of the path of the html file,
// we package them together with potree
let lazyLibs = {
  geopackage: "public/Potree/libs/geopackage",
  "sql.js": "public/Potree/libs/sql.js",
};

let shaders = [
  "public/Potree/src/materials/shaders/pointcloud.vs",
  "public/Potree/src/materials/shaders/pointcloud.fs",
  "public/Potree/src/materials/shaders/pointcloud_sm.vs",
  "public/Potree/src/materials/shaders/pointcloud_sm.fs",
  "public/Potree/src/materials/shaders/normalize.vs",
  "public/Potree/src/materials/shaders/normalize.fs",
  "public/Potree/src/materials/shaders/normalize_and_edl.fs",
  "public/Potree/src/materials/shaders/edl.vs",
  "public/Potree/src/materials/shaders/edl.fs",
  "public/Potree/src/materials/shaders/blur.vs",
  "public/Potree/src/materials/shaders/blur.fs",
];

// For development, it is now possible to use 'gulp webserver'
// from the command line to start the server (default port is 8080)
gulp.task(
  "webserver",
  gulp.series(async function () {
    server = connect.server({
      port: 1234,
      https: false,
    });
  })
);

gulp.task("examples_page", async function (done) {
  await Promise.all([createExamplesPage(), createGithubPage()]);

  done();
});

gulp.task("icons_viewer", async function (done) {
  // await createIconsPage();

  done();
});

gulp.task("test", async function () {
  console.log("asdfiae8ofh");
});

gulp.task("workers", async function (done) {
  for (let workerName of Object.keys(workers)) {
    gulp
      .src(workers[workerName])
      .pipe(concat(`${workerName}.js`))
      .pipe(gulp.dest("public/build/potree/workers"));
  }

  done();
});

gulp.task("lazylibs", async function (done) {
  for (let libname of Object.keys(lazyLibs)) {
    const libpath = lazyLibs[libname];

    gulp
      .src([`${libpath}/**/*`])
      .pipe(gulp.dest(`public/build/potree/lazylibs/${libname}`));
  }

  done();
});

gulp.task("shaders", async function () {
  const components = ["let Shaders = {};"];

  for (let file of shaders) {
    const filename = path.basename(file);

    const content = await fsp.readFile(file);

    const prep = `Shaders["${filename}"] = \`${content}\``;

    components.push(prep);
  }

  components.push("export {Shaders};");

  const content = components.join("\n\n");

  const targetPath = `./public/build/shaders/shaders.js`;

  if (!fs.existsSync("public/build/shaders")) {
    fs.mkdirSync("public/build/shaders");
  }
  fs.writeFileSync(targetPath, content, { flag: "w" });
});

gulp.task(
  "build",
  gulp.series(
    gulp.parallel(
      "workers",
      "lazylibs",
      "shaders",
      "icons_viewer",
      "examples_page"
    ),
    async function (done) {
      gulp.src(paths.html).pipe(gulp.dest("public/build/potree"));

      gulp
        .src(paths.resources)
        .pipe(gulp.dest("public/build/potree/resources"));

      gulp.src(["LICENSE"]).pipe(gulp.dest("public/build/potree"));

      done();
    }
  )
);

gulp.task("pack", async function () {
  exec("rollup -c", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});

gulp.task(
  "watch",
  gulp.parallel("build", "pack", "webserver", async function () {
    let watchlist = [
      "src/**/*.js",
      "src/**/**/*.js",
      "src/**/*.css",
      "src/**/*.html",
      "src/**/*.vs",
      "src/**/*.fs",
      "resources/**/*",
      "examples//**/*.json",
      "!resources/icons/index.html",
    ];

    watch(watchlist, gulp.series("build", "pack"));
  })
);
