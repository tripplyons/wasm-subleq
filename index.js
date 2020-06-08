const iw = require('inline-webassembly')
const fs = require('fs')

const prog = fs.readFileSync('subleq.wat', { encoding: 'utf8' })

function runAndLog(subleq) {
    console.log('----------------')
    console.log('About to run')
    // get the instruction pointer
    let ip = subleq.getIp()
    let a = ip
    let b = ip + 1
    let c = ip + 2
    // get data from memory and log
    console.log('A =', subleq.get(a))
    console.log('B =', subleq.get(b))
    console.log('C =', subleq.get(c))
    console.log('*A =', subleq.get(subleq.get(a)))
    console.log('*B =', subleq.get(subleq.get(b)))

    console.log('IP =', ip)

    subleq.runInstr()
    console.log('Done running')

    console.log('*B =', subleq.get(subleq.get(b)))

    ip = subleq.getIp()
    console.log('IP =', ip)
}

iw(prog, {
    js: {
        ip: new WebAssembly.Global({value:'i32', mutable:true})
    }
}).then((subleq) => {
    subleq.set(0, 123)
    subleq.set(1, 321)

    // load instructions
    subleq.set(3, 0)
    subleq.set(4, 1)
    subleq.set(5, 9)

    // set instruction pointer (0 when module initiated)
    subleq.setIp(3)

    runAndLog(subleq)
});
