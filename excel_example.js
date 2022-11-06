const XLSX = require("xlsx");
const fs = require('fs');
const path = require('path');


//console.log (XLSX);

function readFile(url){
  let file = fs.readFileSync( ('C:/Users/Brandon/Desktop/fuente_ejemplo_excel.json'), { encoding: "utf-8" });
  file = JSON.parse(file);  
  const filter = file.filter(row => row.terms.some(term => term.type === "prez"));
  
  const rows = filter.map((row, index) => ({
    id: index+1,
    name: row.name.first + " " + row.name.last,
    gender: row.bio.gender
  }));

  // Generar la hoja y el libro de trabajo
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
  /* fix headers */
  XLSX.utils.sheet_add_aoa(worksheet, [["Id", "Name", "Gender"]], { origin: "A1" });

  XLSX.writeFile( workbook, "Presidents.xlsx" );  
  /* create an XLSX file and try to save to Presidents.xlsx */
  /*XLSX.writeFileAsync(workbook, "Presidents.xlsx", { compression: false }, (err)=>{
    console.log(err)});*/
  
  // sconsole.log(rows);
  /*return file;*/
}

  readFile();


