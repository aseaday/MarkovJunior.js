MarkovJunior.js
===
> [MarkovJunior](https://github.com/mxgmn/MarkovJunior) is a probabilistic programming language where programs are combinations of rewrite rules and inference is performed via constraint propagation. MarkovJunior is named after mathematician Andrey Andreyevich Markov, who defined and studied what is now called Markov algorithms. This project is a javascript port from the original implementation to be more friendily for uses in Web Application.

The MarkovJunior.js is a port from the original MarkovJunior version. It aims to:
- Support browser for more use in web application and gaming.
- Provide another format of XML script for convenient use.

## Live Build :rocket:
Please visit this [playground](https://markov-junior-js.vercel.app/) to see a live demo.

**Note**: This work is in active development and is still in its infancy. At the moment, MarkovJunior.js only supports a 2D and limited color pixel. And the following node are supported:

- SequenceNode
- OneNode

Read the [plan](./plan.md) for the roadmap and [the contributing guide section](#contributing-guide) if you are interested in developing this work together.

## Getting Started

* Please read the README.md of the [original repo](https://github.com/mxgmn/MarkovJunior/README.md) first for an overview of what MarkovJunior does. 
* Download the source code, and run `npm install` to install the dependencies.
* Run `npm run dev` to start the WebPack server.



> Note: MarkovJunior.js only supports basic and simple scripts for now.

![Basic](./docs/assets/Basic.gif)

## Contributing :black_nib:

There are three major parts:

- *Interpreter*: It is a interpreter and the nodes implementations you can found in `Interpreter.cs` and other node files such as `AllNode.cs`
- *Script*: Helps parse and convert the XML and JSON (in the future) correctly. It is passed to the interpreter as an entrance.
- *Render*: Renders the result given by interpreter. Please refer to the [test](tests/interpreter.spec.ts) for more details.

People interested in helping contribute could work on the following:

- Inference
- Fields
- File and legend support
- 3D generation
- Other nodes support
- A more flexible demo

Welcome to contribute together.