import  {XmlVendor} from '../src/script/xmlVendor';
describe("xmlVendor", () => {
    test("test if xmlVendor read from file.", () => {
        const xmlDoc = new XmlVendor("models/basic.xml");
        console.log(xmlDoc.jsObj);
      })
});

export {};