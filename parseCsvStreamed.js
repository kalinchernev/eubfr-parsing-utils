const fs = require("fs");
const parse = require("csv-parse");
const transform = require("stream-transform");

const transformRecord = require("./transform");

const readStream = fs.createReadStream("projects.csv");
const writeStream = fs.createWriteStream("./projects.json");

const parser = parse({ columns: true, delimiter: ";" });

const transformer = transform(
  (record, cb) => {
    try {
      const data = transformRecord(record);
      return cb(null, `${JSON.stringify(data)}\n`);
    } catch (e) {
      return cb(e);
    }
  },
  { parallel: 10 }
);

readStream
  .pipe(parser)
  .on("error", e => console.error(`Error on parse: ${e.message}`))
  .pipe(transformer)
  .on("error", e => console.error(`Error on transform: ${e.message}`))
  .pipe(writeStream)
  .on("error", e => console.error(`Error on write: ${e.message}`))
  .on("end", () => console.log("Done"));
