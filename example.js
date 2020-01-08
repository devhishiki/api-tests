const generateJSONExample = require('./utils/generate-json-excel');
const path = require('path');

var options = {
    inputExcelFile: path.join(__dirname, 'data/tests.xlsx'),
    schemaName: 'Customer',
    sheetName: 'request'
};

var items = [ 'Example', 'Example2']; 
items.forEach(function( dataColName ) {
    var json = generateJSONExample(options.inputExcelFile, options.sheetName, options.schemaName, dataColName);
    console.log(JSON.stringify(json));
});
