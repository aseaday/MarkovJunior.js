import XmlElement from '../src/script/xmlElement';
describe("xmlVendor", () => {
  test("test if xmlElemnt get name", () => {
    const xmlDoc = XmlElement.LoadFromFile("models/xml/basic.xml");
    expect(xmlDoc.name).toBe("one");
  });
  test("test if xmlElemnt get elements", () => {
    const xmlDoc = XmlElement.LoadFromFile("models/xml/Noise.xml");
    expect(xmlDoc.Elements().length).toBe(3);
  });
  test("test if xmlElemnt get filtered elements", () => {
    const xmlDoc = XmlElement.LoadFromFile("models/xml/Cave.xml");
    expect(xmlDoc.Elements(["prl", "convolution"]).length).toBe(3);
  });
  test("test if xlm could get descendants", () => {
    const xmlDoc = XmlElement.LoadFromFile("models/xml/Noise.xml");
    let i = 0;
    for (const ele of xmlDoc.MyDescendants(["all"])) {
      expect(ele.name).toBe("all");
      i++;
    }
    expect(i).toBe(2);
  });
});

export { };