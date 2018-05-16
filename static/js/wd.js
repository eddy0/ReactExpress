const log = console.log.bind(console)

const e = (sel, element=document) => {
    return element.querySelector(sel)
}

const er = (sel, element=document) => element.querySelectorAll(sel)


const es = (sel, element=document) => {
    return element.querySelectorAll(sel)
}

const removeClassAll = (className) => {
    const element = es(`.${className}`)
    for (let i = 0; i < element.length; i++ ) {
        element[i].classList.remove(className)
    }
}

const bind = (selector, eventName, callback) => {
    const sel = e(selector)
    sel.addEventListener(eventName, (event) => {
        callback(event)
    })
}

const bindAll = (className, eventName, callback) => {
    const selector = es(`.${className}`)
    for (let i = 0; i < selector.length; i++ ) {
        selector[i].addEventListener(eventName, (event) => {
            callback(event)
        })
    }
}

const ajax = (method, path, data, callback) => {
    const r = new XMLHttpRequest()
    r.open(method, path, true)
    r.setRequestHeader('Content-Type', 'application/json')
    r.onreadystatechange = () => {
        if (r.readyState === 4 ) {
            if( r.status === 200) {
                let res = JSON.parse(r.response)
                callback(res)
                return res
            } else {
                throw new Error('ajax error', r.status)
            }
        }
    }
    data = JSON.stringify(data)
    r.send(data)
}


const promiseAjax = (method, path, data) => {
    let promise = new Promise((reslove, reject) => {
        const r = new XMLHttpRequest()
        r.open(method, path, true)
        r.setRequestHeader('Content-Type', 'application/json')
        r.onreadystatechange = () => {
            if (r.readyState === 4) {
                reslove(r.response)
            } else {
                reject(r.status)
            }
        }
        r.send(data)
    })
    return promise
}

const appendHtml = (element, t) => {
    element.insertAdjacentHTML('beforeend', t)
}



const formattedTime = () => {
    const currentTime = new Date()
    const year = currentTime.getFullYear()
    // 0-11
    const month = currentTime.getMonth()
    // 1-31
    const date = currentTime.getDate()
    //0-sun
    const day = currentTime.getDay()

    return {year, month, date, day}

}

const listen = ( element, EventName, callback) => {
    return element.addEventListener(EventName, callback )
}
