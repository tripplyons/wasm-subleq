const iw = require('inline-webassembly')
const fs = require('fs')

const prog = fs.readFileSync('subleq.wat', { encoding: 'utf8' })

function runAndLog(subleq, n=1) {
    console.log('----------------')
    console.log('About to run')
    // get the instruction pointer
    let ip = subleq.getIp()
    let a = ip
    let b = ip + 1
    let c = ip + 2
    // get data from memory and log
    console.log('IP =', ip)

    console.log('A =', subleq.get(a))
    console.log('B =', subleq.get(b))
    console.log('C =', subleq.get(c))
    console.log('*A =', subleq.get(subleq.get(a)))
    console.log('*B =', subleq.get(subleq.get(b)))

    subleq.runInstrs(n)
    console.log(`Done running ${n} instruction(s)`)

    ip = subleq.getIp()
    console.log('IP =', ip)
    console.log('*B =', subleq.get(subleq.get(b)))

    console.log('----------------')
}

iw(prog).then((subleq) => {
    // example program that keeps on subtracting 1 from address 1
    // load data
    subleq.set(0, 1)

    // load instructions (same thing)
    subleq.set(3, 0)
    subleq.set(4, 1)
    subleq.set(5, 3)

    // set instruction pointer (0 when module initiated)
    subleq.setIp(3)

    let startTime = (new Date()).getTime()
    runAndLog(subleq, 100000000)
    let endTime = (new Date()).getTime()

    console.log(`took ${endTime - startTime}ms`)
});
