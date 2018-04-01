const log = () => console.log.bind(console)

const random = (start=60, end=80 ) => {
    const n = Math.random()
    const r = n * ( end - start + 1 ) + start
    return Math.floor(r)
}

const rank = (propertyName) => {
    const f = (object1, object2) => {
        let value1 = object1[propertyName]
        let value2 = object2[propertyName]
        if (value1 > value2) {
            return 1
        } else if (value1 > value2) {
            return -1
        } else {
            return 0
        }
    }
    return f
}

module.exports = {
    log: log,
    random: random,
    rank: rank,
}
