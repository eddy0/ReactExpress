const log = console.log.bind(console)

const random = (start=60, end=80) => {
    const n = Math.random()
    const r = n * ( end - start + 1 ) + start
    return Math.floor(r)
}

const sortBy = (name) => {
    let f = (object1, object2) => {
        let o1 = object1[name]
        let o2 = object2[name]
        if (o1 > o2) {
            return -1
        } else {
            return 1
        }
    }
    return f
}



module.exports = {
    log: log,
    random: random,
    sortBy: sortBy,
}