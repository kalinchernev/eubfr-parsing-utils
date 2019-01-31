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
    const useful = ["Core Indicators", "Agregated Indicaters"];
    const projects = [];
    const buffer = Buffer.concat(buffers);
    const workbook = XLSX.read(buffer);
    const sheets = workbook.SheetNames;

    sheets.map(sheet => {
      const records = [];
      const ws = workbook.Sheets[sheet];
      const rows = XLSX.utils.sheet_to_json(ws);

      if (useful.includes(sheet) && rows.length) {
        const header = rows.shift();

        rows.forEach(row => {
          const record = {};

          Object.keys(row).map(field => {
            const improvedField = header[field].replace(/(\r\n|\n|\r)/gm, " ");
            record[improvedField] = row[field];
          });

          records.push(record);
        });

        projects.push(records);
      }
    });

    const p1 = projects.pop();
    const p2 = projects.pop();

    p1.forEach((p1project, key) => {
      const projectMerged = Object.assign({}, p1project, p2[key]);
      projects.push(projectMerged);
    });

    debugger;
  });
};

export default handler;
