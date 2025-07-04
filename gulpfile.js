const fs = require('fs-extra');
const path = require('path');
const gulp = require('gulp');
const shell = require('gulp-shell');
const merge = require('merge-stream');

const PACK_SRC = `./data`;
const PACK_DEST = `./packs`;


/* ----------------------------------------- */
/*  Compile and Extract packs to yaml
/* ----------------------------------------- */

function compilePacks() {
  // Add every folder in the src folder so they become a compendium.
  const folders = fs.readdirSync(PACK_SRC).filter((file) => {
    return fs.statSync(path.join(PACK_SRC, file)).isDirectory();
  });

  // Create a stream for all files in the source folders.
  const packs = folders.map((folder) => {
    console.log(`Compendium Source: ${folder}`);
    return gulp.src(path.join(PACK_SRC, folder))
      .pipe(shell([
        `fvtt package --id daggerheart --type System pack <%= file.stem %> -c --yaml --in "<%= file.path %>" --out ${PACK_DEST}`
      ]))
  })

  // Call the streams and execute them.
  return merge.call(null, packs);
}

function extractPacks() {
  // Start a stream for all db files in the packs dir.
  const packs = gulp.src(`${PACK_DEST}/*`)
    .pipe(shell([
      `fvtt package --id daggerheart --type System unpack <%= file.stem %> -c --yaml --in ${PACK_DEST} --out ${PACK_SRC}/<%= file.stem %>`
    ]));

  // Call the streams and execute them.
  return merge.call(null, packs);
}

/* ----------------------------------------- */
/*  Export Tasks
/* ----------------------------------------- */

module.exports = {
  pack: compilePacks,
  unpack: extractPacks,
}