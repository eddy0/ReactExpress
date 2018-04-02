const toText = (val, before, after) => {
    return Math.abs(val) + (val > 0 ? before : after)
}

const formattedTime = (date) => {
    let ms = Date.now() - new Date(date).getTime()
    // 误差修正
    if (ms > 0) {
        ms += 1000
    }
    else{
        ms -= 1000
    }

    const minute = parseInt(ms / 1000 / 60)
    const hour = parseInt(minute / 60)
    const day = parseInt(hour / 24)
    const month = parseInt(day / 30)
    const year = parseInt(day / 365)

    // const minute = time.getMinutes()
    // const hour = time.getHours()
    // const day = time.getDay()
    // const month = time.getMonth() + 1
    // const year = time.getFullYear()

    if (year) return toText(year, '年前', '年后')
    else if (month) return toText(month, '个月前', '个月后')
    else if (day) return toText(day, '天前', '天后')
    else if (hour) return toText(hour, '小时前', '小时后')
    else if (minute) return toText(minute, '分钟前', '分钟后')
    else return ms > 0 ? '刚刚' : '不到一分钟之后'
}

const replace = (str) => {
    let s = str.replace('\r\n', '<br>')
    return s
}

module.exports = {
    formattedTime: formattedTime,
    replace: replace,
}
