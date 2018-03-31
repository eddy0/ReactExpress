const log = () => console.log.bind(console)

const random = (start=60, end=80 ) => {
    const n = Math.random()
    const r = n * ( end - start + 1 ) + start
    return Math.floor(r)
}


module.exports = {
    log: log,
    random: random,
}
