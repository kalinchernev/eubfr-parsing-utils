import fs from "fs";
import path from "path";

// Specific to the given parser.
import XLSX from "xlsx";

import transformRecord from "../lib/transform";

export const handler = () => {
  const { FILE: file } = process.env;

  const readStream = fs.createReadStream(path.resolve(`../../${file}.xlsm`));

  const buffers = [];

  readStream.on("data", data => {
    buffers.push(data);
  });

  readStream.on("error", error => {
    return console.error(error);
  });

  readStream.on("end", () => {
    const buffer = Buffer.concat(buffers);
    const workbook = XLSX.read(buffer);
    const sheets = workbook.SheetNames;

    return sheets.map(sheet => {
      const ws = workbook.Sheets[sheet];
      const data = JSON.stringify(XLSX.utils.sheet_to_json(ws));

      return fs.writeFileSync(path.resolve(`./${sheet}.json`), data);
    });
  });
};

export default handler;
