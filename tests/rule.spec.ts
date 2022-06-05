import Grid from "../src/interpreter/grid";
import Rule from "../src/interpreter/rule";
import XmlElement from "../src/script/xmlElement";

describe("test Rule class", () => {
    test("test rule parser", () => {
        console.log(Rule.Parse("B"));
        console.log(Rule.Parse("EG/BB"));
    })
    test("test rule load", () => {
        const xelem = XmlElement.LoadFromFile("models/xml/Basic.xml")
        const gin = Grid.Load(xelem, 10, 10, 10);
        const gout = gin;
        const rule = Rule.Load(xelem, gin, gout);
        console.log(rule.input);
    })
})