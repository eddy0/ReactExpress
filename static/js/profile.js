
const pushState = () => {
    window.addEventListener('popstate', (event) => {
        let state = event.state
        let page = state.page
        toggleActive(page)
        showPage(page)
    })
}

const templateTopic = (t) => {
    let template = `
    <div class="content-item">
                    <span class="content-author">
                        <a href="/user/${t.author._id}" class="author-avatar">
                        <img src="/user/avatar/${t.author.avatar}" alt="" title="${t.author.nickname}"/>
                    </a>
                    </span>
                    <span class="content-title">
                         <a href="/topic/${t._id}"  style="display: inline-block">
                        <span>${ t.title }</span>
                        </a>
                    </span>

                    <span class="content-info">
                        <span class="content-comments"  title="comments">${ t.comments }</span>
                        <span class="content-views"  title="views"> ${ t.views } </span>
                    </span>

                    <span class="content-date">
                         ${ new Date(t.createdTime).toLocaleString('en-US',
        {
            year: '2-digit',
            month:'2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }) }
                    </span>
                </div>
    `
    return template
}

const templateComment = (t) => {
    let template = `
    <div class="content-item">
                    <span class="content-author">
                        <a href="/user/${t.author._id}" class="author-avatar">
                        <img src="/user/avatar/${t.author.avatar}" alt="" title="${t.author.nickname}"/>
                    </a>
                    </span>
                       <div class="comment-item">

                        <div class="content-comment">
                                ${ t.content }
                        </div>
                        
                         <div class="comment-to-title">
                                 <span style="font-size: 14px; color: #999; margin-right: 10px; vertical-align: top">reply to topic:</span>
                                 <a href="/topic/${t.topic._id}" >
                                     <span>
${ t.topic.title }
                                   </span>
                                 </a>
                             </div>
                        </div>

             
                    <span class="content-info">
                        <span class="content-comments"  title="comments">${ t.topic.comments }</span>
                        <span class="content-views"  title="views">${ t.topic.views }</span>
                    </span>

                    <span class="content-date">
                       ${ new Date(t.createdTime).toLocaleString('en-US', 
        {
            year: '2-digit', 
            month:'2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }) }
                       
                    </span>
                </div>
    `
    return template
}

const insertPage = (page) => {
    const mapper = {
        'topic': templateTopic,
        'comment': templateComment,
        'bookmark': templateTopic,
        'star': templateTopic,
    }

    let path = window.location.pathname
    let f = new UserAjax().fetch(path).then( (data) => {
        if (data.success && data.data.length > 0 ) {
            let content = data.data
            let t = content.map( (d) => {
                return mapper[page](d)
            })
            t = t.join('\r\n')
            const wrapper = e('.content-list')
            wrapper.insertAdjacentHTML('beforeend', t)
        }
    })
}

const initPage = () => {
    const wrapper = e('.content-list')
    wrapper.innerHTML = ''
}

const showPage = (page) => {
    initPage()
    insertPage(page)
}

const toggleActive = (page) => {
    let items = es('.menu-item')
    for (let i = 0; i < items.length; i++ ) {
        let item = items[i]
        let target = e('a', item)
        let p = target.dataset.page
        if (p === page) {
            removeClassAll('active')
            item.classList.add('active')
        }
    }
}

const pageEvent = () => {
   const menu = e('.menu')
    let pages = ['topic', 'comment', 'bookmark', 'star' ]
    menu.addEventListener('click', (event) => {
        event.preventDefault()
        let self = event.target
        let page = self.dataset.page
        if (pages.includes(page)) {
            toggleActive(page)
            let state = {
                page: page,
            }
            history.pushState(state, 'profile', page)
            document.title = page
            showPage(page)
        }
    })

}

const profileMain = () => {
    pageEvent()
    pushState()
}

profileMain()