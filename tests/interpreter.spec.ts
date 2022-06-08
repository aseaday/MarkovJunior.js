import XmlElement from '../src/script/xmlElement';
import Interpreter from '../src//interpreter/index';
import {SequenceNode} from '../src/interpreter/branch';
describe("test interpreter", () => {
    test("if it run a basic xml", () => {
        const modeldoc = XmlElement.LoadFromFile("models/xml/basic.xml");
        const interpreter: Interpreter = Interpreter.Load(modeldoc, 10, 10, 1);
        const gen = interpreter.Run(100, 10, true);
        for (let i = 0; i < 10; i++) {
            console.log(gen.next());
        }
    });
})