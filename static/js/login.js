class AlertLogin extends Alert {
    constructor(args) {
        super(args)
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
            console.log('clicked', this.container )
            this.container.classList.toggle('alert-show')
            if(this.has(event)('wd-login-submit')) {
                const username = this.e('.login-username')
                const password = this.e('.login-password')
                const val = {
                    username: username.value,
                    password: password.value
                }
                this.fire(true, val)
            } else if(this.has(event)('wd-login-cancel')) {
                this.fire(false)
            }
        })
    }
}

const successNotice = () => {
    AlertNotice.create({
        wrapperClass: 'notice',
        title: 'Success',
        notice: 'you have logged in',
        overlayColor: '#D7EFEE',
        wrapperColor: '#fff',
    })
}

const failNotice = () => {
    AlertNotice.create({
        title: 'Failed',
        notice: 'wrong username / password<br> pls try again!'
    })
}

const userTemplate = (user) => {
    let t  = `
    <div class="header-avatar">
                <img src="/user/avatar/${user.avatar}" alt="" data-action="avatar">
                <div class="header-popover" tabindex="0">
                        <ul class="wd-popover-list">
                            <li class="item">
                                <a href="/user/${user._id}">
                                    <svg viewBox="0 0 20 20" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;">
                                        <g>
                                            <path d="M13.4170937,10.9231839 C13.0412306,11.5757324 12.5795351,12.204074 12.6542924,12.7864225 C12.9457074,15.059449 18.2164534,14.5560766 19.4340179,15.8344151 C20,16.4286478 20,16.4978969 20,19.9978966 C13.3887136,19.9271077 6.63736785,19.9978966 0,19.9978966 C0.0272309069,16.4978969 0,16.5202878 0.620443914,15.8344151 C1.92305664,14.3944356 7.20116276,15.1185829 7.40016946,12.7013525 C7.44516228,12.1563518 7.02015319,11.5871442 6.63736814,10.9228381 C4.51128441,7.2323256 3.69679769,4.67956187e-11 10,9.32587341e-14 C16.3032023,-4.66091013e-11 15.4216968,7.4429255 13.4170937,10.9231839 Z"></path>
                                        </g>
                                    </svg>
                                    <span>Profile</span>
                                </a>
                            </li>
                            <li class="item" >
                                <a href="/setting">
                                    <svg viewBox="0 0 20 20"  width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title>
                                        <g>
                                            <path d="M18.868 15.185c-.164.096-.315.137-.452.137-.123 0-1.397-.26-1.617-.233-1.355.013-1.782 1.275-1.836 1.74-.055.454 0 .893.19 1.304.138.29.125.577-.067.85-.863.893-2.165 1.016-2.357 1.016-.123 0-.247-.055-.356-.15-.11-.097-.685-1.14-1.07-1.47-1.303-.954-2.246-.328-2.63 0-.397.33-.67.7-.835 1.126-.07.18-.18.302-.33.37-1.354.426-2.918-.92-3.014-1.056-.082-.11-.123-.22-.123-.356-.014-.138.383-1.276.342-1.688-.342-1.9-1.836-1.687-2.096-1.673-.303.014-.604.068-.92.178-.205.056-.396.03-.588-.054-.888-.462-1.137-2.332-1.11-2.51.055-.315.192-.52.438-.604.425-.164.81-.452 1.15-.85.932-1.262.344-2.25 0-2.634-.34-.356-.725-.645-1.15-.81-.137-.04-.233-.15-.328-.315C-.27 6.07.724 4.95.978 4.733c.255-.22.6-.055.723 0 .426.164.878.22 1.344.15C4.7 4.636 4.784 3.14 4.81 2.908c.015-.247-.11-1.29-.136-1.4-.027-.123-.014-.22.027-.315C5.318.178 7.073 0 7.223 0c.178 0 .33.055.44.178.108.124.63 1.11 1 1.4.398.338 1.582.83 2.588.013.398-.273.96-1.288 1.083-1.412.123-.123.26-.178.384-.178 1.56 0 2.33 1.03 2.438 1.22.083.124.096.248.07.37-.03.152-.33 1.153-.262 1.606.366 1.537 1.384 1.742 1.89 1.783.494.027 1.645-.357 1.81-.344.164.014.315.083.424.206.535.31.85 1.715.905 2.14.027.233-.014.44-.11.562-.11.138-1.165.714-1.48 1.112-.855.982-.342 2.25-.068 2.606.26.37 1.22.905 1.288.96.15.137.26.302.315.494.146 1.413-.89 2.387-1.07 2.47zm-8.905-.535c.644 0 1.246-.123 1.822-.356.575-.248 1.082-.59 1.493-1.016.425-.425.754-.92 1-1.495.247-.562.357-1.18.357-1.81 0-.66-.11-1.262-.356-1.825-.248-.562-.577-1.056-1.002-1.48-.41-.427-.918-.756-1.493-1.003-.576-.233-1.178-.357-1.822-.357-.644 0-1.247.124-1.81.357-.56.247-1.067.576-1.478 1.002-.425.425-.768.92-1 1.48-.247.564-.37 1.167-.37 1.826 0 .644.123 1.248.37 1.81.232.563.575 1.07 1 1.495.424.426.917.768 1.48 1.016.56.233 1.164.356 1.808.356z"></path>
                                        </g>
                                    </svg>
                                    <span>Setting</span>
                                </a>
                            </li>
                            <li class="item"  data-action="logOut">
                                <a href="/logout">
                                    <svg viewBox="0 0 20 20" class="Icon Button-icon Icon--logout" width="14" height="16" aria-hidden="true" style="height: 16px; width: 14px;"><title></title>
                                        <g>
                                            <path d="M0 10C0 7.242 1.154 4.58 3.167 2.697c.51-.477 1.31-.45 1.79.06.475.51.45 1.31-.06 1.787C3.37 5.975 2.53 7.91 2.53 10c0 4.118 3.35 7.468 7.47 7.468 4.12 0 7.47-3.35 7.47-7.47 0-2.04-.81-3.948-2.28-5.37-.5-.485-.514-1.286-.028-1.788.485-.5 1.286-.517 1.79-.03C18.915 4.712 20 7.265 20 10c0 5.512-4.486 9.998-10 9.998s-10-4.486-10-10zm8.7-.483V1.26C8.7.564 9.26 0 9.96 0c.695 0 1.26.564 1.26 1.26v8.257c0 .696-.565 1.26-1.26 1.26-.698 0-1.26-.564-1.26-1.26z"></path>
                                        </g>
                                    </svg>
                                    <span>Logout</span>
                                </a>
                            </li>

                        </ul>
                    </div>

                </div>
    `
    return t
}

const renderLoginHtml = (data) => {
    let container = document.querySelector('.header-info')
    container.innerHTML = ''
    let t = userTemplate(data)
    appendHtml(container, t )
}

// const logoutTemplate = () => {
//     const t =
//         `
//         <div class="header-login">
//                 <a href="javascript:;" class="signIn" data-action="signIn">Sign in</a>
//                 <a href="/signup" class="signUp">Get Started</a>
//             </div>
//         `
//      return t
// }
//
// const renderLogoutHtml = () => {
//     let container = e('.header-info')
//     container.innerHTML = ''
//     let t = logoutTemplate()
//     appendHtml(container, t )
// }

const callbackSignIn = (confirm, value) => {
    if (confirm){
        new LoginApi().siginIn(value)
            .then( (data) => {
            if (data.success === true){
                successNotice()
                renderLoginHtml(data.data)
            } else{
                failNotice()
            }
        })
    }
}

const signInTrigger = () => {
    AlertInput.create({
        title: 'Welcome Back',
        input: [ {
            name: 'username',
            placeholder: 'username',
            type: 'text',
        },
            {
                name: 'password',
                placeholder: 'password',
                type: 'password',
            },
        ]
    }).on(callbackSignIn)
}

const signinRequest = () => {
    AlertInput.create({
        title: 'Please Sign in',
        input: [ {
            name: 'username',
            placeholder: 'username',
            type: 'text',
        },
            {
                name: 'password',
                placeholder: 'password',
                type: 'password',
            },
        ]
    }).on(callbackSignIn)
}

const signOutTrigger = () => {
    log('in')
    renderLogoutHtml()
    // new AJax().post('/logout')
    // l.get('/logout').then( (data) => {
    //     console.log('data', data)
    // })
}

const ToggleUserInfo = () => {
    let wrapper = e('.header-info')
    const popover = e('.header-popover', wrapper)
    popover.classList.add('show-user')
    log('popover', popover)
    popover.focus()
    popover.addEventListener('focusout', (event) => {
        setTimeout( () => {
            popover.classList.remove('show-user')
        }, 150)
    })
}

const actionFromPopover = (self) => {
    const item = self.closest('.item')
    if (item !== null){
        let action = item.dataset.action
        return action
    }
}

const loginEvent = () => {
    const container = e('.header-info')
    let actions = {
        'avatar': ToggleUserInfo,
        'signIn':signInTrigger,
        'logOut':signOutTrigger,
    }

    container.addEventListener('click', (event) => {
        const self = event.target
        let action = self.dataset.action
        log('action',action)
        if (action === undefined){
            action = actionFromPopover(self)
        }
        if (action in actions){
            actions[action](self)
        }
    })
}

loginEvent()