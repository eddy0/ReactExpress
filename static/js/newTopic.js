
const formatContent = (content) => {
    content = content.split('<div>').join('<br>')
    content = content.split('</div>').join('<br>')
    return content
}

const validContent = (str) => {
    str =  str.slice(0, -1)
    let len =str.length
    if (len < 4){
        return false
    }

    let rule = [' ', '&nbsp;']
    let l = str.split('')

    for (let i = 0; i < l.length; i++ ) {
        let char = l[i]
        if (rule.includes(char) ) {
            l.splice(i, 1, char)
        }
    }

    let s = l.join('')

    if (s.length < 4){
        return false
    }
    return str
}

const topicTile = () => {
    const box = e('.title-content')
    let title = box.value
    title = validContent(title)
    return title
}

const topicTag = () => {
    const items = es('.selected')
    if (items.length < 1 ){
        return false
    } else {
        let tags = []
        for (let i = 0; i < items.length; i++ ) {
            let tag = items[i].innerText
            tags.push(tag)
        }
        return tags
    }
}

const topicContent = () => {
    const box = e('.text-container')
    let content = box.innerHTML
    let brief = box.innerText
    let validBrief = validContent(brief)
    return {content, brief, validBrief}
}

const NewTopicSubmit = () => {
    let title = topicTile()
    let tags = topicTag()
    let {content, brief, validBrief} =  topicContent()
    let valid = title && tags && validBrief
    if (valid){
        return {title, tags, content, brief}
    }
}

const selectCheck = () => {
    let items = es('.tag-item')
    for (let i = 0; i < items.length; i++ ) {
        let item = items[i]
        if (item.classList.contains('selected')) {
           return false
        }
    }
    return true
}

const bindTagEvent = () => {
    const list = e('.tag-list')
    list.addEventListener('click', (event) => {
        let self = event.target
        if (self.classList.contains('tag-item')) {
            self.classList.toggle('selected')
        }
        let selected = selectCheck()
        let hint = e('.tag-hint')
        if (selected) {
            hint.style.opacity = 1
        } else {
            hint.style.opacity = 0
        }


    })
    bindAll('tag-item', 'click', (event) => {
    })
}

const actionsSubmit = (element, data) => {
    let cls = element.classList
    if (cls.contains('wd-topic-submit')){
        log(data)
        let api = new TopicApi()
        api.add(data).then( (r) => {
            if (r.success === true) {
                log('success', r)
                new AlertNotice({
                    title:'success',
                    notice: 'add successfully'
                }).on( () => {
                    window.location.href= r.data.next
                })
            } else {
                log('fail')
            }
        })
    }
}

const newTopicEvent = () => {
    bindTagEvent()
    // get the title
    bindAll('wd-topic-btn', 'click', (event) => {
        let self = event.target
        let data = NewTopicSubmit()
        log(data)
        if (data !== undefined){
            actionsSubmit(self, data)
        } else{
            new AlertNotice({
                title: 'Incomplete',
                notice: 'Title length must be greater then 4;<br>Must select a tag'
            })
        }
    })
}

const markdownEvent = () => {
    let md = window.markdownit()
    let td = new window.TurndownService({})
    let markdown = e('.markdown-container')
    const text = e('.text-container')
    text.addEventListener('input', () => {
        let val = text.innerHTML
        let r = td.turndown(val)
        log('r',r)
        markdown.innerText = r
    })

    markdown.addEventListener('input', () => {
        let val = markdown.innerText
        let r = md.render(val)
        text.innerHTML = r
    })


}

const __TopicMain = () => {
    // markdownEvent()
    newTopicEvent()
    let editor = new MediumEditor('.text-container')
}




document.addEventListener("DOMContentLoaded", function(event) {
    __TopicMain()

})
