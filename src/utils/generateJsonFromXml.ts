import { IScriptElement } from '../script';
import XmlElement from '../script/xmlElement';
import * as fs from 'fs';
describe("test generate json", () => {
    test("generate json", () => {
        const palette = XmlElement.LoadFromFile("resources/palette.xml");
        const results = [];
        for (const elem of palette.Elements()) {
            const result = {
                name: elem.Get("name", ""),
                rgb: elem.Get("rgb", ""),
                symbol: elem.Get("symbol", ""),
                value: elem.Get("value", "")
            }
            results.push(result);
        }
        fs.writeFileSync("resources/palette.json", JSON.stringify(results));
    });
})