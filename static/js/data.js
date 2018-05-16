 // {
    //  "1520582400000":
    //    [
    //        {
    //            id: 1,
    //            reminder: {
    //                task: 'ojbk',
    //                done: false,
    //                '_delete': false,
    //            }
    //        },
    //        {
    //            id: 2,
    //            reminder: {
    //                task: 'ojssssbk',
    //                done: false,
    //                '_delete': false,
    //            }
    //        }
    //    ],
    //
    //
    //
    // "1520755200000":
    //         [
    //             {
    //                 id: 1,
    //                 reminder: {
    //                     task: 'ojbk',
    //                     done: false,
    //                     '_delete': false,
    //                 }
    //             },
    //             {
    //                 id: 2,
    //                 reminder: {
    //                     task: 'ojssssbk',
    //                     done: false,
    //                     '_delete': false,
    //                 }
    //             }
    //         ]
    //     }

let __globalData = {}

const loadFile = () => {
    const file = localStorage.calendar
    if (file !== undefined) {
        const data = JSON.parse(file)
        __globalData = data
    }
}

const save = (data) => {
    let __globalData =  data
    localStorage.calendar = JSON.stringify(__globalData)
}

const validData = (unixTime) => {
    let globalData = __globalData
    for (let t  in globalData) {
        if (t === String(unixTime)) {
            let database = globalData[unixTime]
            if (database) {
                let data = database.filter( d => {
                    let reminder = d.reminder
                    return reminder['_delete'] === false
                })
                return data
            }
        }
    }
}

const dateByHighlight = () => {
    const {year, month, date} = currentHighlightTime()
    const unixTime = new Date(year, month, date).getTime()
    const database = validData(unixTime) || []
    return database
}

const loadReminderData = () => {
    const {todoContainer} = reminderContainer()
    todoContainer.innerHTML=''
    const data = dateByHighlight()
    if (data) {
        for (let i = 0; i < data.length; i++) {
            let d = data[i]
            insertTodoTemplate(d)
        }
    }
}

// data = {unixTime: [{},{}], }
const createData = (data) => {
    let globalData = __globalData

    let form = {}
    const {year, month, date} = currentHighlightTime()
    const unixTime = new Date(year, month, date).getTime()
    const time = String(unixTime)
    if (globalData[time] === undefined) {
        form = {
            id: 1,
            reminder: {
                'task': data.task,
                'done': false,
                '_delete': false
            }
        }
        globalData[time] = [form]
    } else {
            const arr = globalData[time]
            console.log('array', arr)
            const lastItem = arr[arr.length - 1 ]
            const id = lastItem.id + 1
            console.log('arr', arr, arr.length)

            form = {
                id: id,
                reminder: {
                    'task': data.task,
                    'done': false,
                    '_delete': false
                }
            }
            arr.push(form)
        }

    save(globalData)
    return form
}

const removeData = (index) => {
    let globalData = __globalData
    const {year, month, date} = currentHighlightTime()
    const unixTime = String(new Date(year, month, date).getTime())
    let database = __globalData[unixTime]
    let data = database.find( d  => d.id === Number(index))
    if (data) {
        let reminder =  data.reminder
        reminder['_delete'] = true
    }
    save(globalData)

}

const updateData = (form) => {
    let globalData = __globalData

    const {year, month, date} = currentHighlightTime()
    const unixTime = new Date(year, month, date).getTime()
    const time = String(unixTime)
    const database = globalData[time]
    const index = database.findIndex( d => d.id === form.id)
    if (index > -1) {
        database.splice(index, 1, form)
    }

    save(globalData)

}



