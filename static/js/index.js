

const starUpdate = (wrapper) => {
    let box = wrapper.closest('.wd-card')
    let id = box.dataset.id
    let status = false
    if (wrapper.classList.contains('starred')) {
        status = false
    } else {
        status = true
    }
    new TopicApi().star(id, status)
        .then((data) => {
            if (data.success) {
                wrapper.classList.toggle('starred')
                let count = e('.star-count',wrapper)
                log(count, data)
                count.innerText = `${data.data} Stars`
            } else {
                signinRequest()
            }
        })
}

const markUpdate = (wrapper) => {
    let box = wrapper.closest('.wd-card')
    let id = box.dataset.id
    let status = false
    if (wrapper.classList.contains('marked')) {
        status = false
    } else {
        status = true
    }
    new TopicApi().mark(id, status)
        .then((data) => {
            if (data.success) {
                wrapper.classList.toggle('marked')
            } else {
                signinRequest()
            }
        })
}

const starEvent = () => {
    bindAll('action-star', 'click',  (event) => {
        let self = event.target
        let wrapper = self.closest('.action-star')
        starUpdate(wrapper)
    })

    bindAll('action-mark', 'click',  (event) => {
        let self = event.target
        let wrapper = self.closest('.action-mark')
        markUpdate(wrapper)
    })
}


// toggle full and expand

const insertHtml = (wrapper, html) => {
    wrapper.innerHTML = ''
    wrapper.insertAdjacentHTML('beforeend', html)
}

const fullTemplate = (content) => {
    let t = `
                            <span class="content-detail">
                              ${content}
                            </span>
                        <span class='content-expand'>
                                <span>brief</span>
                                <svg class="icon icon-down" style="transform: rotate(180deg) translate(0, 60%)" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/></svg>
                            </span>
                  
             
    
    `
    return t
}

const briefTemplate = (content) => {
    let t = `
                            <span class="content-detail">
                              ${content}
                            </span>
                        <span class='content-expand'>
                                <span>more</span>
                                <svg class="icon icon-down" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/></svg>
                            </span>
                  
             
    
    `
    return t
}

const getFullContent = (wrapper, id) => {
    new TopicApi().full(id)
        .then((data) => {
            if (data.success) {
                let content = data.data
                let t = fullTemplate(content)
                insertHtml(wrapper, t)
            }
        })
}

const getBriefContent = (wrapper, id) => {
    new TopicApi().brief(id)
        .then((data) => {
            if (data.success) {
                let content = data.data
                let t = briefTemplate(content)
                insertHtml(wrapper, t)
            }
        })

}

const toggleClass = (content) => {
    content.classList.toggle('brief')
    content.classList.toggle('full')
}

const expandContentEvent = () => {
    bindAll('content-main', 'click', (event) => {
        let self = event.target
        let content = self.closest('.content-main')
        let box = self.closest('.wd-card')
        let id = box.dataset.id
        if (content.classList.contains('brief')) {
            getFullContent(content, id)
            toggleClass(content)
        } else if (content.classList.contains('full')) {
            getBriefContent(content, id)
            toggleClass(content)
        }
    })
}

const __topicMain = () => {
    expandContentEvent()
    starEvent()
}

__topicMain()