const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src', 'locales', 'en', 'translation.json');
const arPath = path.join(__dirname, 'src', 'locales', 'ar', 'translation.json');

const newEn = JSON.parse(fs.readFileSync('temp_en.json', 'utf8'));
const newAr = JSON.parse(fs.readFileSync('temp_ar.json', 'utf8'));

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target, source) {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

let en = {};
let ar = {};

try { en = JSON.parse(fs.readFileSync(enPath, 'utf8')); } catch (e) {}
try { ar = JSON.parse(fs.readFileSync(arPath, 'utf8')); } catch (e) {}

en = mergeDeep(en, newEn);
ar = mergeDeep(ar, newAr);

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(arPath, JSON.stringify(ar, null, 2));

console.log('Translations updated successfully');
