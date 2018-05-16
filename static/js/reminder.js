const reminderContainer = () => {
    const addButton = e('.add-item-button')
    const addContainer = e('.add-item-container')
    const newContentContainer = e('.add-item-content')
    const todoContainer = e('.reminder-items')

    return {
        addButton,
        addContainer,
        newContentContainer,
        todoContainer,
        }
}

const addContainerToggle = () => {
    const {addButton, addContainer , newContentContainer} = reminderContainer()
    // open add container
    addButton.addEventListener('click',  () => {
        if (addContainer.classList.contains('open')) {
            addContainer.classList.remove('open')
            newContentContainer.value=''
        } else {
            addContainer.classList.add('open')
            newContentContainer.focus()
        }
    })
}

const undoAdd = () => {
    const {addContainer, newContentContainer} = reminderContainer()
    if (addContainer.classList.contains('open')) {
        addContainer.classList.remove('open')
        newContentContainer.value=''
        newContentContainer.blur()
    }
}

const todoTemplate = (data) => {
    // data = {id : 1, reminder: {task:'', done:true, _delete:false,}}
    const reminder = data.reminder
    const task = reminder.task
    let status = {
        checked: '',
        done: '',
    }
    if (reminder.done) {
        status.checked = 'checked'
        status.done = 'done'
        }

    const t = `
            <div class="reminder-item "  data-index=${data.id}>
                <input type="checkbox" class="item-status ${status.checked}">
            <span class="item-content ${status.done}" contenteditable="false">${task}</span>
            <div class="item-actions">
                <svg class="icon icon-edit" fill="#ffffff" height="20" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                <svg class="icon icon-delete" fill="#ffffff" height="20" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
            </div>
        </div>
    `
    return t
}

const insertTodoTemplate = (data) => {
    const {todoContainer} = reminderContainer()
    const t = todoTemplate(data)
    todoContainer.insertAdjacentHTML('beforeend', t)
    undoAdd()
}

const todoContentUpdate = (container) => {
    const keys = {
        Enter: 'Enter',
        Escape: 'Escape',
    }
    listen(container, 'keydown', event => {
        let key = event.key
            if (key === keys[key]) {
                event.preventDefault()
                container.blur()
                container.setAttribute('contentEditable', false)

                // todo edit data update
            }
            if (key === 'Enter') {
                const p = container.parentElement
                const id = Number(p.dataset.index)
                const task = container.innerText
                const form = {
                    id: id,
                    reminder : {
                        task: task,
                        done: false,
                        _delete: false,
                        }
                    }
                updateData(form)
            }

    })
}

const todoDoneupdate = (container, content) => {
    const p = container.parentElement
    const id = Number(p.dataset.index)
    const task = content.innerText
    let  done = false
    if (container.classList.contains('checked')) {
        done = true
    }
    const form = {
        id: id,
        reminder : {
            task: task,
            done: done,
            _delete: false,
        }
    }
    updateData(form)

}
// edit & remove & done
const todoUpdate = () => {
    const {todoContainer} = reminderContainer()

    listen(todoContainer, 'click', event => {
        const target = event.target
        const p = event.target.parentElement
        const contentCell = target.closest('.reminder-item')

        // edit
        const edit = target.classList.contains('icon-edit') || p.classList.contains('icon-edit')
        if (edit) {
            // if todostatus is not done before editable
            const todoStatus = e('.item-status', contentCell)
            const checked = todoStatus.classList.contains('checked')
            const content = e('.item-content', contentCell)
            if ( checked === true) {
                content.classList.remove('done')
                todoStatus.classList.remove('checked')
            }
            content.setAttribute('contentEditable', true)
            content.focus()
            todoContentUpdate(content)
        }

        // delete
        const remove = target.classList.contains('icon-delete') || p.classList.contains('icon-delete')
        if (remove) {
            const index = contentCell.dataset.index
            // console.log('index,', index)

            contentCell.remove()

            // remove data
            removeData(index)

            ResponseByData()

        }

        // done
        const todoStatus = target.classList.contains('item-status')
        if (todoStatus) {
            const content = e('.item-content', contentCell)

            if (target.classList.contains('checked')
            ) {
                content.classList.remove('done')
                target.classList.remove('checked')
            } else {
                content.classList.add('done')
                target.classList.add('checked')
            }
            // todo: done update
            todoDoneupdate(target, content)
        }

    })
}

const todoAdd = () => {
    const {newContentContainer} = reminderContainer()
    // keydown event
    listen(newContentContainer, 'keyup', event => {
        // console.log(event.key)
        if (event.key === 'Enter') {
            const value = newContentContainer.value
            const reminder = {
                task: value,
                done: false,
                '_delete': false,
            }

            const data = createData(reminder)

            insertTodoTemplate(data)

            ResponseByData()

        }
        if (event.key === 'Escape') {
            undoAdd(event)
        }
    })
}

const todoEvent = () => {
    addContainerToggle()
    todoAdd()
    todoUpdate()
}


