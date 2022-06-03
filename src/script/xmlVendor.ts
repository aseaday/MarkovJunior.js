const { XMLParser } = require("fast-xml-parser");
import * as fs from 'fs';
const parser = new XMLParser();
export class XmlVendor {
    jsObj: any;
    sheet: string;
    constructor(xmlFileName: string) {
        // const output = parser.parse(xmlDataStr);
        this.jsObj = parser.parse(fs.readFileSync(xmlFileName, "utf8"));
    }
}