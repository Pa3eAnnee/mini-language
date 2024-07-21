import variables from '../variables.js';
import { crawl } from '../../getting/crawler.js';
import { evalCond } from './evalCond.js';
import { evalLoop } from './evalLoop.js';
import { get, assign } from '../variables.js';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

export const evalExpr = async (expr) => {
    if (!expr && expr !== 0) {
        throw new Error("Expression is undefined");
    }
    let $;
    let attr;
    let tag;
    let value;
    let text;
    let key;
    switch (expr.type) {
        case '+':
            return (await evalExpr(expr.val1)) + (await evalExpr(expr.val2));
        case '-':
            return (await evalExpr(expr.val1)) - (await evalExpr(expr.val2));
        case '*':
            return (await evalExpr(expr.val1)) * (await evalExpr(expr.val2));
        case '/':
            return (await evalExpr(expr.val1)) / (await evalExpr(expr.val2));
        case '<':
            return (await evalExpr(expr.val1)) < (await evalExpr(expr.val2));
        case '>':
            return (await evalExpr(expr.val1)) > (await evalExpr(expr.val2));
        case '<=':
            return (await evalExpr(expr.val1)) <= (await evalExpr(expr.val2));
        case '>=':
            return (await evalExpr(expr.val1)) >= (await evalExpr(expr.val2));
        case '==':
            return (await evalExpr(expr.val1)) == (await evalExpr(expr.val2));
        case '!=':
            return (await evalExpr(expr.val1)) != (await evalExpr(expr.val2));
        case '&&':
            return (await evalExpr(expr.val1)) && (await evalExpr(expr.val2));
        case '||':
            return (await evalExpr(expr.val1)) || (await evalExpr(expr.val2));
        case '!':
            return !(await evalExpr(expr.val1));
        case 'NUMBER':
            return expr.value;
        case 'VARNAME':
            return get(expr.name);
        case 'GETFROM':
            const domain = await evalExpr(expr.domain);
            return await crawl(domain);
        case 'ASSIGN':
            const val = await evalExpr(expr.value);
            assign(expr.name, val);
            return get(expr.name);
        case 'ARRAY':
            return Promise.all(expr.elements.map(evalExpr)); // Évalue chaque élément du tableau
        case 'ARRAY_ACCESS':
            let array = await evalExpr(expr.array);
            const index = await evalExpr(expr.index);
            return array[index];
        case 'ARRAY_ASSIGN':
            let targetArray = await evalExpr(expr.array);
            const targetIndex = await evalExpr(expr.index);
            const newValue = await evalExpr(expr.value);
            targetArray[targetIndex] = newValue;
            return newValue;
        case 'ONLY_TAG':
            const tagArray = await evalExpr(expr.array);
            tag = await evalExpr(expr.tag);
            $ = cheerio.load(`${tagArray}`);
            return $(tag).parent().html();
        case 'ONLY_HAS_ATTR':
            const attrArray = await evalExpr(expr.array);
            attr = await evalExpr(expr.attr);
            $ = cheerio.load(`<div>${attrArray}</div>`);
            return $(`[${attr}]`).parent().html();
        case 'ONLY_IS_ATTR':
            const onlyIsAttrArray = await evalExpr(expr.array);
            attr = await evalExpr(expr.attr);
            value = await evalExpr(expr.value);
            $ = cheerio.load(`<div>${onlyIsAttrArray}</div>`);
            return $(`[${attr}=${value}]`).parent().html();
        case 'ONLY_CONTAINS_TEXT':
            const textArray = await evalExpr(expr.array);
            text = await evalExpr(expr.text);
            $ = cheerio.load(`<div>${textArray}</div>`);
            return $(`:contains(${text})`).parent().html();
        case 'EXTRACT_CONTENT':
            const contentArray = await evalExpr(expr.array);
            $ = cheerio.load(`<div>${contentArray}</div>`);
            return $(contentArray).text();
        case 'SPLIT_HTML':
            const splitArray = await evalExpr(expr.array);
            if(splitArray === null) return [];
            $ = cheerio.load(splitArray);
            const children = $(splitArray).children();
            const result = [];
            children.each((_, child) => {
                result.push($.html(child));
            });
            return result;
        case 'JOIN_HTML':
            const joinArray = await evalExpr(expr.array);
            return joinArray.join('');
        case 'GET_HTML':
            const pageHtml = await evalExpr(expr.page);
            return pageHtml.html;
        case 'GET_URL':
            const pageUrl = await evalExpr(expr.page);
            return pageUrl.url;
        case 'IS_TAG':
            const element = await evalExpr(expr.element);
            tag = await evalExpr(expr.tag);
            $ = cheerio.load(element);
            return $(element).is(tag);
        case 'HAS_ATTR':
            const elementHasAttr = await evalExpr(expr.element);
            attr = await evalExpr(expr.attr);
            $ = cheerio.load(`<div>${elementHasAttr}</div>`);
            return $(`[${attr}]`).length > 0;
        case 'IS_ATTR':
            const elementIsAttr = await evalExpr(expr.element);
            attr = await evalExpr(expr.attr);
            value = await evalExpr(expr.value);
            $ = cheerio.load(`<div>${elementIsAttr}</div>`);
            return $(`[${attr}="${value}"]`).length > 0;
        case 'CONTAINS_TEXT':
            const elementContainsText = await evalExpr(expr.element);
            text = await evalExpr(expr.text);
            $ = cheerio.load(elementContainsText);
            return $(elementContainsText).text().includes(text);
        case 'CREATE_OBJECT':
            return {};
        case 'SET_PROPERTY':
            const obj = await evalExpr(expr.object);
            key = await evalExpr(expr.key);
            value = await evalExpr(expr.value);
            obj[key] = value;
            return obj;
        case 'GET_PROPERTY':
            const targetObj = await evalExpr(expr.object);
            key = await evalExpr(expr.key);
            return targetObj[key];
        case 'CONCAT':
            const str1 = await evalExpr(expr.string1);
            const str2 = await evalExpr(expr.string2);
            return str1 + str2;
        case 'SUBSTRING':
            const str = await evalExpr(expr.string);
            const start = await evalExpr(expr.start);
            const end = await evalExpr(expr.end);
            return str.substring(start, end);
        case 'REPLACE':
            const originalStr = await evalExpr(expr.string);
            const searchValue = await evalExpr(expr.searchValue);
            const replaceValue = await evalExpr(expr.replaceValue);
            return originalStr.replace(searchValue, replaceValue);
        case 'SAVE_AS_JSON':
            const jsonData = await evalExpr(expr.data);
            const jsonFile = await evalExpr(expr.filePath);
            const jsonFilePath = jsonFile.replace(/"/g, '');
            const jsonDir = path.dirname(jsonFilePath);
            fs.mkdirSync(jsonDir, { recursive: true });
            fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf-8');
            return `Data saved as JSON to ${jsonFilePath}`;
        case 'SAVE_AS_TEXT':
            const textData = await evalExpr(expr.data);
            const textFile = await evalExpr(expr.filePath);
            const textFilePath = textFile.replace(/"/g, '');
            const textDir = path.dirname(textFilePath);
            fs.mkdirSync(textDir, { recursive: true });
            fs.writeFileSync(textFilePath, textData, 'utf-8');
            return `Data saved as text to ${textFilePath}`;
        case 'ARRAY_CONTAINS':
            const arrayToCheck = await evalExpr(expr.array);
            const valueToCheck = await evalExpr(expr.value);
            return arrayToCheck.includes(valueToCheck);
        case 'cond':
            return await evalCond(expr);
        case 'loop':
            return await evalLoop(expr);
        // New array manipulation functions
        case 'PUSH':
            const pushArray = await evalExpr(expr.array);
            const pushValue = await evalExpr(expr.value);
            pushArray.push(pushValue);
            return pushArray;
        case 'POP':
            const popArray = await evalExpr(expr.array);
            return popArray.pop();
        case 'SHIFT':
            const shiftArray = await evalExpr(expr.array);
            return shiftArray.shift();
        case 'UNSHIFT':
            const unshiftArray = await evalExpr(expr.array);
            const unshiftValue = await evalExpr(expr.value);
            unshiftArray.unshift(unshiftValue);
            return unshiftArray;
        case 'INSERT':
            const insertArray = await evalExpr(expr.array);
            const insertValue = await evalExpr(expr.value);
            const insertIndex = await evalExpr(expr.index);
            insertArray.splice(insertIndex, 0, insertValue);
            return insertArray;
        case 'REMOVE':
            const removeArray = await evalExpr(expr.array);
            const removeIndex = await evalExpr(expr.index);
            return removeArray.splice(removeIndex, 1)[0];
        case 'LENGTH':
            const lengthArray = await evalExpr(expr.array);
            return lengthArray.length;
        default:
            return expr;
    }
};
