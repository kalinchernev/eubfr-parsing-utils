const fs = require("fs");
const XLSX = require("xlsx");

const workbook = XLSX.readFile(".xlsm");

fs.writeFileSync(".json", JSON.stringify(workbook));
