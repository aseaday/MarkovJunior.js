import XmlElment from '../src/script/xmlElement';
describe("xmlVendor", () => {
  test("test if xmlElemnt get name", () => {
    const xmlDoc = new XmlElment();
    xmlDoc.LoadFromFile("models/xml/basic.xml");
    expect(xmlDoc.name).toBe("one");
  });
  test("test if xmlElemnt get elements", () => {
    const xmlDoc = new XmlElment();
    xmlDoc.LoadFromFile("models/xml/Noise.xml");
    expect(xmlDoc.Elements().length).toBe(3);
  });
  test("test if xlm could get descendants", () => {
    const xmlDoc = new XmlElment();
    xmlDoc.LoadFromFile("models/xml/Noise.xml");
    let i = 0;
    for (const ele of xmlDoc.MyDescendants(["all"])) {
      expect(ele.name).toBe("all");
      i++;
    }
    expect(i).toBe(2);
  });
});

export { };