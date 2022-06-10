import Interpreter from "../interpreter";
import { IScriptElement } from "../script";
import XmlElement from "../script/xmlElement";
import Paint from "./paint";
// It only support 2D for the moment
export default class CanvasRender {
    canvas: HTMLCanvasElement;
    MX: number;
    MY: number;
    MZ = 1;
    timer: ReturnType<typeof setInterval>;
    interpreter: Interpreter;
    scriptString: string;
    scriptRoot: IScriptElement;
    canvasHandler: CanvasRenderingContext2D;
    paint: Paint;
    options = {
        fps: 24,
        scale: 10,
    }
    constructor(canvas: HTMLCanvasElement, options?: any) {
        this.canvas = canvas;
        this.MY = canvas.height / this.options.scale;
        this.MX = canvas.width / this.options.scale;
        this.canvasHandler = canvas.getContext('2d');
        this.paint = new Paint(this.MX, this.MY);
    }

    public render(script: string): void {
        this.scriptRoot = XmlElement.LoadFromString(script);
        this.interpreter = Interpreter.Load(this.scriptRoot, this.MX, this.MY, this.MZ);
        const gen = this.interpreter.Run(1, 1000, true);
        this.timer = setInterval(() => {
            const frame = gen.next().value;
            if (frame) {
                this.paint.setFrame(frame);
                for (let x = 0; x < this.MX; x++) {
                    for (let y = 0; y < this.MY; y++) {
                        this.canvasHandler.fillStyle = "#" + this.paint.getPixel(x, y);
                        this.canvasHandler.fillRect(x * 10, y * 10, 10, 10);
                    }
                }
            }
        }, Math.floor(1000 / this.options.fps));
    }

    public stopRender(): void {
        clearInterval(this.timer);
    }
}