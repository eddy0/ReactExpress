
const post = (val) => {
    let id =$('.messages').attr('data-id')
    let form = {
        content: val,
        id:id,
        date: Date.now(),
    }
    log('form', form)
    // $.post('http://111.230.7.89/chat/add', form)
    new ChatAjax().add(form)
}


const messageEvent = () => {

    $('.btn-chat-send').on('click', (event) => {
        let input = $('.input-chat-content')
        let val = input.val()
        post(val)
        input.val('')
    })

    $('.input-chat-content').on( 'keyup',  (event) => {
        if (event.key === 'Enter') {
            let val = event.target.value
            event.target.value= ''
            post(val)
        }
    })

}



const socketEvent = () => {
    let socket = io()

    const templateFriend = (data) => {
        let t = `
                    <li class="replies clearfix">
                     <div class="feed">
                        <img src="/user/avatar/${data.user.avatar}" title="${data.user.username}" alt="${data.user.username}" />
                        <span> ${data.user.username} </span>
                    </div>
                    <p class="content-detail">${data.content}</p>
                </li>

            `
        return t
    }

    const templateSelf = (data) => {
        log(data, data.content)
        let t = `
                <li class="sent clearfix">
                    <div class="feed">
                        <img src="/user/avatar/${data.user.avatar}"                          title="${data.user.username}" alt="${data.user.username}" />
                        <span> ${data.user.username} </span>
                    </div>
                    <p class="content-detail">${data.content}</p>
                </li>
            `
        return t
    }

    const newTemplate = (data) => {
        const t = `
                <li class="contact" data-id="${data.user._id}" data-socket=''>
                    <div class="wrap">
                        <img src="/user/avatar/${data.user.avatar}" alt="" />
                        <div class="meta">
                            <p class="name">${data.user.username}</p>
                            <p class="preview">${data.content || ''}</p>
                        </div>
                    </div>
                </li>
            `
        return t
    }

    const appendTime = (time, wrapper) => {
        const t = `
             <li class="time"> ${ new Date(time).toLocaleString() }</li>
            `
        wrapper.append(t)
    }

    // socket.on('new', function(data){
    //     let t
    //     let wrapper = $('.contacts-list')
    //     log(data)
    //     t =  newTemplate(data)
    //     wrapper.append(t)
    // })
    //
    // socket.on('delete', function(id){
    //     let wrapper = $('.contacts-list')
    //     let item = wrapper.find('li').find(`[data-id=${id}]`)
    //     console.log('item', item)
    //
    //
    //
    // })

    socket.on('total', function(n){
        // console.log('item', n)
        let count = e('.chat-count')
        count.innerText = `${n} connection`

    })


    socket.on('message', function(data){
        let t
        let wrapper = $('.messages-list')
        let id = Number(wrapper.attr('data-id'))
        let time = Number(data.date)
        appendTime(time, wrapper)
        if ( id !== data.user._id ) {
            t = templateFriend(data)
        } else {
            t = templateSelf(data)
        }
        log('ss',$('.messages')[0].scrollHeight)
        wrapper.append(t)
        log($('.messages')[0].scrollHeight)

        setTimeout( () => {
            $(".messages").animate({ scrollTop: $('.messages')[0].scrollHeight }, "fast");
        }, 300)

    })



}


const main = () => {
    $(".messages").animate({ scrollTop: $('.messages')[0].scrollHeight }, 'fast' )
    messageEvent()
    socketEvent()
}

main()


