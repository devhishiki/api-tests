const lodash = require('lodash');
const XLSX = require('xlsx');
const assert = require('assert');

const primitiveTypes = ['boolean', 'integer', 'number', 'string', 'any'];

global.dataColName;
module.exports = function(inputExcelFile, sheetName, schemaName, dataColName) {
  assert(inputExcelFile, 'Please provide Input Excel Sheet location');
  assert(sheetName, 'Please provide Sheet Name');
  assert(schemaName, 'Please provide Schema Name');
  assert(dataColName, 'Please provide Data Column Name');

  global.dataColName = dataColName;
  console.log(`Generating json schema ${schemaName} from ${inputExcelFile}`);
  const workbook = XLSX.readFile(inputExcelFile);
  const modelInfo = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  // Group by Model Names
  const modelList = lodash.chain(modelInfo)
    .groupBy(value => value.Name)
    .value();

  // Generate JSON Examples
  const output = lodash.mapValues(modelList, (v, k) => generateJSON(k, v, modelList));

  var jsonData;
  lodash.forEach(output, (value, key) => {
    if (key == schemaName) {
      jsonData = value;
    }
  });
  return jsonData;
};

function generateJSON(modelName, model, modelList) {
  return lodash.reduce(model, (result, value) => {
    let jsonValue;
    if (lodash.includes(primitiveTypes, lodash.lowerCase(value.Type))) {
      if (global.dataColName in value) {
        jsonValue = value[global.dataColName];
      } else {
        switch (value.Type) {
          case 'any':
            jsonValue = null;
            break;
          case 'boolean':
            jsonValue = null;
            break;
          case 'string':
            jsonValue = null;
            break;
          case 'number':
          case 'integer':
            jsonValue = null;
            break;
          default:
        }
      }
    } else if (modelList[value.Type]) {
      if (value.Relation) return result;
      jsonValue = generateJSON(value.Type, modelList[value.Type], modelList);
    } else {
      console.log('somthing wrong processing', value.Property);
      return result;
    }

    if (jsonValue && !isEmptyKeysLength(jsonValue)) {
      if (lodash.lowerCase(value.ParentType) === 'array') jsonValue = [jsonValue];
      result[value.Property] = jsonValue;
    }
    return result;
  }, {});
}

function isEmptyKeysLength(obj){
  return !Object.keys(obj).length;
}
