class Alert {
    constructor() {
        this.init()
        this.container = this.e('.wd-login-container')
        this.action = undefined
    }

    on(event){
        this.action = event
        return this
    }

    fire(...args) {
        if (this.action !== undefined) {
            this.action.apply(this, args)
        }
    }

    e(sel) {
        return document.querySelector(sel)
    }

    es(sel){
        return document.querySelectorAll(sel)
    }

    bindAll(selector, eventName, callback){
        const element = this.es(selector)
        for (let i = 0; i < element.length; i++ ) {
            let tag = element[i]
            tag.addEventListener(eventName, (event) => {
                callback(event)
            })
        }
    }

    has(event) {
        let self = event.target
        return self.classList.contains.bind(self.classList)
    }

    init() {
        this.initframe()
    }

    initframe(){
        if (this.container !== null){
            this.container.remove()
        }
        let t = `
            <div class="wd-login-container alert-show">
                <div class="wd-login-overlay"></div>
                <div class="wd-login-box"></div>
            </div>
            `
        document.body.insertAdjacentHTML('beforeend', t)
    }

    insertHtml(t){
        let box = this.e('.wd-login-box')
        box.innerHTML = t
    }
}

class AlertNotice extends Alert {
    constructor(args) {
        super()
        this.title = args.title || ''
        this.notice = args.notice || ''
        this.appendHtml()
        this.actionAlert()
    }

    noticeTemplate() {
        const t = `
                <div class="wd-login-box">
                    <div class="wd-login-title">
                        ${this.title.toUpperCase()}
                    </div>
                    <div class="wd-login-content">
                         ${this.notice}
                    </div>
                    <div class="wd-login-btns">
                    <button class="wd-login-btn wd-login-notice">OK</button>
                     </div>
                </div>
            `
            return t
        }

    appendHtml() {
        const t = this.noticeTemplate()
        this.insertHtml(t)
    }

    actionAlert(){
        this.container.addEventListener('click', () => {
            this.container.classList.toggle('alert-show')
        })
    }
}

class AlertConfirm extends Alert {
    constructor(args) {
        super()
        this.title = args.title || ''
        this.notice = args.notice || ''
        this.callback = args.callback || new Function()
        this.appendHtml()
        this.actionAlert()
    }

    confirmTemplate() {
        const t = `
                <div class="wd-login-box">
                    <div class="wd-login-title">
                        ${this.title.toUpperCase()}
                    </div>
                    <div class="wd-login-content">
                         ${this.notice}
                    </div>
                    <div class="wd-login-btns">
                    <button class="wd-login-btn wd-alert-confirm">OK</button>
                    <button class="wd-login-btn wd-login-reject">NO</button>
                    </div>
                </div>
            `
        return t
    }

    appendHtml() {
        const t = this.confirmTemplate()
        this.insertHtml(t)
    }

    actionAlert(){
        this.bindAll('.wd-login-btn', 'click', (event) => {
            this.container.classList.toggle('alert-show')
            if (this.has(event, 'wd-alert-confirm')){
                this.callback(true)
            } else if (this.has(event,'wd-login-reject')) {
                this.callback(false)
            }
        })
    }
}

class AlertLogin extends Alert {
    constructor(args) {
        super()
        this.title = args.title || ''
        this.placeholder = args.placeholder || []
        this.callback = args.callback || new Function()
        this.appendHtml()
        this.actionAlert()
    }

    PromptTemplate() {
        const t = (`
                    <div class="wd-login-title">
                        ${this.title}
                    </div>
                    <div class="wd-login-inputWrapper">
                        <input class="wd-login-input login-username" type="text" placeholder="${this.placeholder[0]}">
                        <input class="wd-login-input login-password" type="password" placeholder="${this.placeholder[1]}">
                    </div>
                    <div class="wd-login-btns">
                    <button class="wd-login-btn wd-login-submit">Sign In</button>
                    <button class="wd-login-btn wd-login-cancel">Cancel</button>
                    </div>
                    <div class="wd-login-signup">
                    <span>No account? </span>
                    <a href="">Create one.</a>
</div>
            `)
        return t
    }

    appendHtml() {
        const t = this.PromptTemplate()
        this.insertHtml(t)
    }

    actionAlert() {
        this.bindAll('.wd-login-btn', 'click', (event) => {
            console.log('clicked', event, this,  this.has(event)('wd-login-submit') )
            this.container.classList.toggle('alert-show')
            if(this.has(event)('wd-login-submit')) {
                const input = this.e('.wd-login-input')
                const val = input.value
                this.fire(true, val)
            } else if(this.has(event)('wd-login-cancel')) {
                this.fire(false)
            }
        })
    }
}




// alertNotice()
// alertConfirm()
// alertLogin()

let test = () => {
    let confirmFunction = (confirm, value) => {
        if (confirm){
            new AlertConfirm({
                title: 'confirm?',
                notice: `you have typed ${value}`,
                callback: (confirmed) => {
                    if (confirmed){
                        let a = new AlertNotice({
                            title: 'notice',
                            notice: `you have submitted `
                        })
                    } else{
                        console.log('cancelled')
                        let a = new AlertNotice({
                            title: 'cancelled',
                            notice: 'you have cancelled'
                        })
                    }},
            })
        } else{
            new AlertNotice({
                title: 'cancelled',
                notice: 'you have cancelled'
            })
        }
    }

    new AlertLogin({
        title: 'Welcome Back',
        placeholder: [
                        'username',
                        'password',
                    ]
    }).on(confirmFunction)

}

test()

