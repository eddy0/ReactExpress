
const starUpdate = (wrapper) => {
    let box = e('.content-box')
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
                count.innerText = `${data.data}`
            }
        })
}

const markUpdate = (wrapper) => {
    let box = e('.content-box')
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
            }
        })
}

const starEvent = () => {
    bind('.action-star', 'click',  (event) => {
        let self = event.target
        let wrapper = self.closest('.action-star')
        starUpdate(wrapper)
    })

    bind('.action-mark', 'click',  (event) => {
        let self = event.target
        let wrapper = self.closest('.action-mark')
        markUpdate(wrapper)
    })
}

const renderReplyTemplate = (data) => {
    let author = ''
    if (data.isAuthor) {
        author = `(author)`
    }
    let replyto = ''
    let authorId = $('.author-avatar').attr('href').split('/').slice(-1)[0]
    let replyToAuthor = data.replyToAuthor
    if (replyToAuthor !== null && replyToAuthor._id === authorId) {
        replyto = `(author)`
    }
    let t = `
    <div class="comment-item" data-id="${data._id}">
                <div class="comment-feed">
                        <span class="comment-author">
                            <a href="/user/${data.user._id}" class="comment-author-self">

                                ${data.user.nickname}${author}
                           
                            </a>

                             
                            <span class="word-reply-to">reply to</span>

                            <a href="/user/${data.replyToAuthor._id}" class="comment-reply-to">
                               ${data.replyToAuthor.nickname}${replyto}
                            </a>
                         
                        </span>

                    <span class="comment-date">
                           ${ data.createdTime}
                        </span>

                </div>

                <div class="comment-content">
                    ${ data.content }
                </div>

                <div class="comment-action clear-fix">
                    <span class="action-reply">
                    <i class="fas fa-reply"></i>
                        reply
                    </span>
                </div>

                <div class="comment-reply-wrapper clear-fix">
                    <section class="input-comment-reply" contenteditable="true" tabindex="1" data-topic="${data._id}">
                    </section>
                    <div class="wd-comment-btn wd-reply-cancel ">
                        cancel
                    </div>

                    <div class="wd-comment-btn wd-reply-btn">

                        submit
                    </div>


                </div>

                </div>
    `
    return t
}

const renderReply = (data) => {
    let t = renderReplyTemplate(data)
    let list = e('.comment-list')
    list.insertAdjacentHTML('afterbegin', t)
}

const replySubmit = (wrapper) => {
    let button = e('.wd-reply-btn', wrapper)
    let input = e('.input-comment-reply', wrapper)
    button.addEventListener('click', (event) => {
        if (button.classList.contains('reply')) {
            let text = input.innerHTML
            let item = input.closest('.comment-item')
            let id = item.dataset.id
            let topicId = input.dataset.topic
            let data = {
                content: text,
                replyToId: id,
                topicId: topicId,
            }
            log(data)

            new CommentApi().reply(data)
                .then( (data) => {
                    if (data.success) {
                        log('reply data', data)
                        renderReply(data.data)
                        let replyWrapper = wrapper.closest('.comment-reply-wrapper')
                        $(replyWrapper).hide(100)
                    }
                })
        }
    })

}

const enableReply = (wrapper) => {
    let replyBtn = e('.wd-reply-btn', wrapper)
    let input = e('.input-comment-reply', wrapper)
    input.addEventListener('keyup', (event) => {
        let text = input.innerText
        if (text.length > 2 ) {
            replyBtn.classList.add('reply')
        } else {
            replyBtn.classList.remove('reply')
        }
    })

}

const cancelReply = (wrapper) => {
    let cancelBtn = e('.wd-reply-cancel', wrapper)
    cancelBtn.addEventListener('click', (event) => {
        let input = e('.input-comment-reply', wrapper)
        $(wrapper).hide(100)
        input.innerText = ''

    })
}

const replyBtnEvent = (wrapper) => {
    enableReply(wrapper)
    cancelReply(wrapper)
    replySubmit(wrapper)

}

const replyEdit = () => {
    let list = e('.comment-list')
    list.addEventListener('click', (event) => {
        let self = event.target
        if (self.classList.contains('action-reply')) {
            let comment = self.closest('.comment-item')
            let replyWrapper = e('.comment-reply-wrapper', comment)
            $(replyWrapper).show(100)
            replyBtnEvent(replyWrapper)
        }
    })
}

const replyEvent = () => {
    replyEdit()

}

const generalCommentTemplate = (data) => {
    let author = ''
    if (data.isAuthor) {
        author = `(author)`
    }
    let t = `
       <div class="comment-item" data-id="${data._id}">
                <div class="comment-feed">
                        <span class="comment-author">
                            <a href="/user/${data.user._id}" class="comment-author-self">
                            ${data.user.nickname} ${author}
                           
                            </a>
                        </span>

                    <span class="comment-date">
                           ${ data.createdTime}
                        </span>

                </div>


                <div class="comment-content">
                    ${data.content}
                </div>

                   <div class="comment-action clear-fix">
                    <span class="action-reply">
                    <i class="fas fa-reply"></i>
                        reply
                    </span>
                </div>
                <div class="comment-reply-wrapper clear-fix">
                    <section class="input-comment-reply" contenteditable="true" tabindex="1" data-topic="${data.topicId}">
                    </section>
                    <div class="wd-comment-btn wd-reply-cancel ">
                        cancel
                    </div>

                    <div class="wd-comment-btn wd-reply-btn">

                        submit
                    </div>


                </div>

            </div>
    `
    return t
}

const updateCommentBody = (data) => {
    let box = e('.comment-list')
    let t = generalCommentTemplate(data)
    box.insertAdjacentHTML('afterbegin', t)

}

const topicCommentData = () => {
    const wrapper = e('.input-comment-add')
    let content = wrapper.innerHTML
    return {content}
}

const commentSubmit = () => {
    const button = e('.wd-comment-btn')
    const wrapper = e('.input-comment-add')
    button.addEventListener('click', ()=> {
        if (button.classList.contains('wd-comment-submit')) {
            let data = topicCommentData()
            new CommentApi().add(data)
                .then( (data) => {
                    if (data.success) {
                        updateCommentBody(data.data)
                        wrapper.innerText = ''
                    }
                })
        }
    })
}

const commentEdit = () => {
    const wrapper = e('.input-comment-add')
    // wrapper.addEventListener('focusin', (event) => {
    //     let placeholder = e('.placeholder', wrapper)
    //     if (placeholder !== null) {
    //         placeholder.remove()
    //             wrapper.focus()
    //     }
    // })
    //
    // wrapper.addEventListener('focusout', (event) => {
    //     let t = (`
    //      <span class="placeholder" style="color: #646464"><em>Add Your Comments</em></span>
    //     `)
    //     // if (wrapper.innerText === '') {
    //     //     wrapper.insertAdjacentHTML('beforeend', t)
    //     // }
    // })
    //

    const button = e('.wd-comment-btn')
    wrapper.addEventListener('keyup', (event) => {
        let text = wrapper.innerText
        if (text.length > 2 ) {
            button.classList.add('wd-comment-submit')
        } else {
            button.classList.remove('wd-comment-submit')
        }
    })
}

const commentView = () => {
    let search = location.search
    if (search) {
        let query = location.search.split('?')[1]
        let [k, v]  = query.split('=')
        if (k === 'content' && v === 'comment') {
            let comment = e('.comment-box')
            setTimeout( () => {
                comment.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                })
            }, 100)
        }
    }
}

const commentMain = () => {
    let editor = new MediumEditor('.input-comment-add', {
        placeholder: {
            text: 'Add Your Comments',
            hideOnClick: true,
        }
    })
    let reply = new MediumEditor('.input-comment-reply', {
        placeholder: {
            text: 'Add Your Reply',
            hideOnClick: true,
        }
    })
    commentView()
    commentEdit()
    commentSubmit()
    replyEvent()
    starEvent()
}

commentMain()