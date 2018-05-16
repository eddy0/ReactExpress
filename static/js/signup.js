
// const validPassword = (s) => {
//     let status = {
//         min: true,
//         max: true,
//         type: true,
//     }
//
//     let letter = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
//     let number = '0123456789'
//     let special = '_'
//     let rules = letter + number + special
//     if (s.length < 3 ) {
//         status.min = false
//     }
//     if (s.length > 10) {
//         status.max = false
//     }
//     for (let i = 0; i < s.length; i++) {
//         if (!rules.includes(s[i])) {
//             status.type = false
//         }
//     }
//     return status
// }


// const signUpMapper = () => {
//     let mapper = {
//         'login-username': validUsername,
//         'login-password': validPassword,
//     }
//     return mapper
// }

const submitEvent = () => {
    if (input.classList.contains('login-username') && status.valid === true){
        UniqueUsername(val)
            .then((data) => {
                if (data.success){
                    status = {
                        valid: true,
                        hint: data.message,
                    }
                    area.classList.add('valid')
                } else {
                    status = {
                        valid: false,
                        hint: data.message,
                    }
                }
                area.innerText = status.hint
            })

    } else {
        area.classList.remove('valid')
    }
    allowSubmit()

}

const inputHandler = (event, callback) => {
    let mapper = ['login-username', 'login-password']
    const self = event.target
    let has = self.classList.contains.bind(self.classList)
    for (let key of mapper) {
        if (has(key)){
            callback(self)
        }
    }
}

const preventDefault = (event) => {
    event.preventDefault()
}

const validUsername = (s) => {
    let status = {
        start: true,
        end: true,
        min: true,
        max: true,
        type: true,
    }
    let letter = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let number = '0123456789'
    let special = '_'
    let rules = letter + number + special
    if (!letter.includes(s[0])) {
        status.start = false
    }
    if (!(letter + number).includes(s[s.length - 1])) {
        status.end = false
    }
    if (s.length < 3 ) {
        status.min = false
    }
    if (s.length > 10) {
        status.max = false
    }
    for (let i = 0; i < s.length; i++) {
        if (!rules.includes(s[i])) {
            status.type = false
        }
    }
    return status
}

const uniqueUsername = () => {
    const input = e('.login-username')
    input.addEventListener('blur', (event) => {
        const hint = e('.wd-username-valid')
        const valid = hint.classList.contains('hint-valid')
        if (valid) {
            let form = {
                username: input.value
            }
            new LoginApi().signUp(form)
                .then( (data) =>{
                    let span = e('.wd-username-exist')
                    let msg =  data.message
                    span.innerText = msg
                    if (data.success){
                        input.classList.add('wd-ready')
                    } else {
                        input.classList.remove('wd-ready')
                    }
                })
        }
    })
}

const SubmitEvent = () => {
    let button = e('.wd-login-btn')
    button.addEventListener('click', (event) => {
        let prevent = event.target.classList.contains('prevent')
        if (prevent) {
            event.preventDefault()
        }
    })
}

const allowSubmit = () => {
    let input = es('.wd-login-input')
    let button = e('.wd-login-btn')
    let ready = true
    for (let i = 0; i < input.length; i++ ) {
        let l = input[i]
        let has = l.classList.contains('wd-ready')
        if (!has) {
            ready = false
        }
    }
    if (ready) {
        button.classList.remove('prevent')
    } else {
        button.classList.add('prevent')
    }
}

const validate = (input) => {
    let name = input.name
    let val = input.value
    let status = validUsername(val)
    const area = e(`.wd-${name}-valid`)
    const items = es('.item', area)
    for (let i = 0; i < items.length; i++ ) {
        let item = items[i]
        let action = item.dataset.action
        if (status[action] === true) {
            item.classList.add('valid')
        } else {
            item.classList.remove('valid')
        }
    }
    validAll(area, items)
    allowSubmit()
}

const validAll = (popover, items) => {
    let valid = true
    for (let i = 0; i < items.length; i++ ) {
        let item = items[i]
        let all = item.classList.contains('valid')
        if (!all) {
            valid = false
        }
    }
    if (valid) {
        if (popover.classList.contains('wd-username-valid')) {
            popover.classList.add('hint-valid')
        } else  {
           const password = e('.login-password')
            password.classList.add('wd-ready')
        }
    } else {
        if (popover.classList.contains('wd-username-valid')) {
            popover.classList.remove('hint-valid')
        } else  {
            const password = e('.login-password')
            password.classList.remove('wd-ready')
        }
    }



}

const signUpEvent = () => {
    let mapper = ['login-username', 'login-password']

    bindAll('wd-login-input', 'focus', (event) => {
        const self = event.target
        let has = self.classList.contains.bind(self.classList)
        for (let key of mapper) {
            if (has(key)){
                let div = key.slice(6)
                removeClassAll('active')
                let hint = e(`.wd-${div}-valid`)
                hint.classList.add('active')
            }
        }
    })

    bindAll('wd-login-input', 'input', (event) =>{
        const self = event.target
        log('self', event)
        let has = self.classList.contains.bind(self.classList)
        for (let key of mapper) {
            if (has(key)){
                validate(self)
            }
        }
    })

}

const showHint = () => {

}

const signUpMonitor = () => {
    showHint()
    signUpEvent()
    SubmitEvent()
    uniqueUsername()
}

signUpMonitor()
