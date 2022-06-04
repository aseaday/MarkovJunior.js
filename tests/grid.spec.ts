import Grid from '../src/interpreter/grid';
import XmlElement from '../src/script/xmlElement';

describe("grid", () => {
    test("test if read basic element.", () =>{
        const xmlDoc = new XmlElement();
        xmlDoc.LoadFromFile("models/xml/basic.xml");
        const grid = new Grid();
        grid.Load(xmlDoc, 10, 10, 10);
        expect(grid.MX).toBe(10);
        expect(grid.MY).toBe(10);
        expect(grid.MZ).toBe(10);
    });
}); 