const { log } = require('./utils.js')


const parseTime = (date) => {
    let ms = Date.now() - new Date(date).getTime()
    // 误差修正
    if (ms > 0) {
        ms += 1000
    } else {
        ms -= 1000
    }
    const minute = parseInt(ms / 1000 / 60)
    const hour = parseInt(minute / 60)
    const day = parseInt(hour / 24)
    const month = parseInt(day / 30)
    const year = parseInt(day / 365)
    return [year, month, day, hour, minute]
}

const formattedTime = (date) => {
    let diff = parseTime(date)
    let times = ['year', 'month', 'day', 'hour', 'minute']
    let mapper = {
        'year': '年前',
        'month': '个月前',
        'day':'天前',
        'hour': '小时前',
        'minute': '分钟前',
    }
    let index = diff.findIndex( (t) => {
        return t > 0
    })
    if (index === -1){

        return '刚刚'
    } else{
        let t = times[index]
        str = String(diff[index])
        return  str + mapper[t]
    }
}

const calendarDate = (time) => {
    let date = new Date(time)
    let options = {
        year: '2-digit',
        month:'2-digit',
        day: '2-digit',
    }
    return date.toLocaleString('en-US', options)
}

const localeDate = (time) => {
    let date = new Date(time)
    let options = {
        year: '2-digit',
        month:'2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }
    return date.toLocaleString('en-US', options)
}

module.exports = {
    formattedTime: formattedTime,
    calendarDate: calendarDate,
    localeDate: localeDate,
}
