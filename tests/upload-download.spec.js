import { test, expect } from '@playwright/test';
const ExcelJS = require('exceljs');


async function writeExcelTest(searchText, replaceText, change, filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet('Sheet1');
  const output = await readExcel(worksheet, searchText);

  const cell = worksheet.getCell(output.row, output.column + change.colChange);
  cell.value = replaceText;
  await workbook.xlsx.writeFile(filePath);
}

function readExcel(worksheet, searchText) {
  let output = { row: -1, column: -1 };
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      console.log(`Row ${rowNumber}, Col ${colNumber} = ${cell.value}`);
      if (cell.value === searchText) {
        output = { row: rowNumber, column: colNumber };
        console.log(`Found '${searchText}' at Row ${rowNumber}, Col ${colNumber}`);
      }
    });
  });
  return output;
}

// writeExcelTest('Iphone', 'Xiaomi',{colChange: 0},'/Users/ngiraldo/Downloads/excel-download-test.xlsx');

//update Mango Price to 350. 
//writeExcelTest("Mango",350,{rowChange:0,colChange:2},"/Users/ngiraldo/Downloads/excel-download-test.xlsx");

test('Upload download excel validation', async ({ page }) => {
  const textSearch = 'Mango';
  const updateValue = '350';
 
  await page.goto('https://rahulshettyacademy.com/upload-download-test/index.html');
 
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download' }).click();
  const dl = await download;
  const filePath = '/Users/ngiraldo/Downloads/download.xlsx'; // or await dl.path()
 
  // ✅ Ensure the edit finishes before upload
  await writeExcelTest(textSearch, updateValue, { rowChange: 0, colChange: 2 }, filePath);
 
  await page.locator('#fileinput').setInputFiles(filePath);
 
  const desiredRow = await page.getByRole('row').filter({ has: page.getByText(textSearch) });
  await expect(desiredRow.locator('#cell-4-undefined')).toContainText(updateValue);
});
 