const fs = require("fs");
const path = require("path");
const through = require("through2");
const split2 = require("split2");

const readStream = fs.createReadStream(path.resolve("./input.ndjson"));

readStream
  .pipe(
    through((chunk, enc, callback) => {
      debugger;
      console.log(chunk);

      callback();
    })
  )
  .pipe(fs.createWriteStream(path.resolve("./out.ndjson")));
