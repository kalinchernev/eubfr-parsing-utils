import fs from "fs";
import path from "path";

// Specific to the given parser.
import XLSX from "xlsx";

import transformRecord from "../lib/transform";

export const handler = () => {
  const { FILE: file } = process.env;

  const readStream = fs.createReadStream(path.resolve(`../../${file}.xlsm`));

  // Put data in buffer
  const buffers = [];

  readStream.on("data", data => {
    buffers.push(data);
  });

  readStream.on("error", error => {
    return console.error(error);
  });

  // Manage data
  readStream.on("end", async () => {
    let dataString = "";

    // Parse file
    const buffer = Buffer.concat(buffers);
    const workbook = XLSX.read(buffer);

    workbook.SheetNames.forEach(sheet => {
      const parsedRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

      debugger;

      for (let i = 0; i < parsedRows.length; i += 1) {
        const data = transformRecord(parsedRows[i]);
        dataString += `${JSON.stringify(data)}\n`;
      }

      fs.writeFileSync(`${file}.ndjson`, dataString);
    });
  });
};

export default handler;
