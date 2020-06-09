# WASM Subleq
A simple Virtual Machine written in raw WebAssembly (WAT)

## Why?

- It works in the browser (or other WASM environments
- It is very fast: about **100,000,000 instructions/second** on my laptop's Chrome browser (twice as fast on Node.js on the same machine)
- It is simple: anyone can program a compatible VM in less than 20 lines of JavaScript/Python code
- It is so easy to port that you can run programs anywhere!

## Usage

Use the [subleq.wasm](subleq.wasm) WebAssembly module like any other module. You can find some usage of its API in [index.js](index.js), but it will be documented later.

## Development Setup

Run the following commands to set things up to run `index.js`:

```
cd wasm-subleq
npm i
```

You can also install [WABT](https://github.com/WebAssembly/wabt) if you want to compile the WAT file to WASM.

## What is Subleq?

Subleq is an [OISC](https://en.wikipedia.org/wiki/One-instruction_set_computer). An OISC is a computer that is fully operational with only one instruction.

### How does it work?

This implementation uses a list of signed 32-bit integers as memory.

Each instruction operates on 3 parameters (A, B, and C). It is implied which instruction you are using because there is only one.

The basic idea of instruction (C-like syntax)

`*b -= *a; if(*b <= 0) goto c;` **SUB**tract, and **L**ess than or **EQ**ual to

JavaScript implementation pseudocode
```javascript
memory = [1, 2, 3, ...]
instructionPointer = 0

while(1) {
    // SUB:
    // *b -= *a
    memory[memory[instructionPointer+1]] -= memory[memory[instructionPointer]]
    // LEQ:
    // if(*b <= 0) {
    if(memory[memory[instructionPointer+1]] <= 0) {
        // goto C
        instructionPointer = memory[instructionPointer+1]
    } else {
        // move on to the next instruction
        instructionPointer += 3
    }
}
```
