

const validImg = (input) => {
    log('file', input.files, input.files[0].type)
    let data = input.files[0]
    let type = ['image/png','image/jpeg', 'image/gif' ]
    if (!type.includes(data.type)) {
        AlertNotice.create({
            title: 'invalid type',
            notice: 'only png/jpeg/gif type are allowed'
        })
        input.value = null
        return false
    } else if (data.size > 204800) {
        AlertNotice.create({
            title: 'file too large',
            notice: 'only less than 200k'
        })
        input.value = null
        return false
    }
    return true
}

const uploadImg = () => {
    const avatar = e('.input-avatar')
    avatar.addEventListener('change', () => {
        let formData = new FormData()
        let valid = validImg(avatar)
        formData.append("avatar", avatar.files[0])
        if (valid) {
            new SettingApi().uploadImg(formData)
                .then((res) => {
                    if (res.success) {
                        let img = e('.avatar-preview')
                        img.src = `/user/avatar/${res.data}`
                    } else {
                        AlertNotice.create({
                            title: 'Error',
                            notice: res.message
                        })
                    }
                })
        }
    })
}

const TriggerEdit = (container, icon) => {
    let type = container.closest('.profile-wrapper')
    let box = container.closest('.text-box')
    let content = $(box).find('.profile-value')
    let value = $(content).text()
    $(content).attr('data-back',value)
    $(content).attr('contenteditable', 'true').focus()
    let inputBtns = $(box).find('.input-btns')
    inputBtns.show(100)
    $(icon).hide()
}

const profileUpdateEvent = () => {
    let mapper = ['.profile-update', '.profile-add']
    $('.profile-wrapper').on('click', (event) => {
        let self = event.target
        for (let m of mapper ) {
            let action = self.closest(m)
            if (action !== null) {
                TriggerEdit(action, m)
            }
        }
    })
}

const actionFromMapper = (element, mapper,...args) => {
    let has = element.classList.contains.bind(element.classList)
    for (let m in mapper ) {
        if (has(m)) {
            mapper[m](element,...args)
        }
    }
}

const iconTemplate = () => {
    let t = `
    <span class="profile-update">
                           <svg  fill="#2b78c1" height="20" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                           <span>profile-update</span>
                       </span>
    `
    return t
}

const  updateIcon = (element, icon) => {
    icon.remove()
    let t = iconTemplate()
    element.insertAdjacentHTML('afterend',t)
}

const updateSubmit = (element, content) => {
    let value = content.innerText
    log('content',  value, element)
    if (value !== ''&& ' ') {
        let key = content.dataset.key
        let data = {
            [key]: value
        }
        new SettingApi().update(data)
            .then( (data) => {
                const add = $(content).closest('.text-box').find('.profile-add').get(0)
                let len = content.innerText.length
                log('add', data,  add, len)
                if (data.success && add && len) {
                    updateIcon(content, add)
                }
            })
    }
}

const updateCancel = (element, content) => {
    let value = content.dataset.back
    log('content',  value)
    content.innerText = value
}

const inputBtnEvent = () => {
    let actions = {
        'wd-input-submit': updateSubmit,
        'wd-input-cancel': updateCancel,
    }
    const btns = $('.input-btns')
    btns.on('click', (event) => {
        event.preventDefault()
        let self = event.target
        let box = self.closest('.text-box')
        let content = e('.profile-value', box)
        actionFromMapper(self, actions, content)
        content.removeAttribute('data-back')
        content.contentEditable = false
        btns.hide(100)
        let icon = $(box).find('.profile-update').get(0)
        if (icon === undefined) {
            icon = $(box).find('.profile-add').get(0)
        }
        $(icon).show()
    })
}

const settingMain = () => {
    uploadImg()
    profileUpdateEvent()
    inputBtnEvent()
}

$(document).ready(function() {
    settingMain()
})
