import Grid from '../src/interpreter/grid';
import XmlElement from '../src/script/xmlElement';

describe("grid", () => {
    test("test if read basic element.", () =>{
        const xmlDoc = XmlElement.LoadFromFile("models/xml/basic.xml");
        const grid = Grid.Load(xmlDoc, 10, 10, 10);
        expect(grid.MX).toBe(10);
        expect(grid.MY).toBe(10);
        expect(grid.MZ).toBe(10);
    });
}); 