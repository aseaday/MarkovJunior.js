MarkovJunior.js
===
> [MarkovJunior](https://github.com/mxgmn/MarkovJunior) is a probabilistic programming language where programs are combinations of rewrite rules and inference is performed via constraint propagation. MarkovJunior is named after mathematician Andrey Andreyevich Markov, who defined and studied what is now called Markov algorithms. This project is a javascript port from the original implementation to be more friendily for uses in Web Application.

The MarkovJunior.js is the port from MarkovJunior orginal version. It tends to be:
- Support browser for more use in web application and gameing.
- Provide another format of XML script for convinience use.

**Note**: This work is in active development and early stage for now, It only supports a 2D and limited color pixel. And the following node are supported:

- SequenceNode
- OneNode

Read the [plan](./plan.md) for recent develop plan and [the contributing guide section](#contributing-guide) if you are intersted in developping this work together.

## Getting Started

Please read the REDAME.md of [orignal repo](https://github.com/mxgmn/MarkovJunior/README.md) first. 

Please visit this [playground](https://markov-junior-js.vercel.app/)

> Note: Only support basic and simple script for now.

![Basic](./docs/assets/Basic.gif)

## Contributing Guide

There are three major part:

- Interpreter: It is a interpreter and the nodes implementations you can found in `Interpreter.cs` and other node files such as `AllNode.cs`
- Script: It helps parse and covert the XML and JSON(in the future) correctly. It would be passed to the interpreter as an entrance.
- Render: Render the result given by interpreter, refer to the [test](tests/interpreter.spec.ts) for more details.

The most of backbone is done. but there is a lot of work to be done. Such as:

- Inference
- Fields
- File and lengend Support
- 3D generation
- Other nodes support
- A more flexiable demo

Welcome to contribute together.