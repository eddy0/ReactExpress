
const colorSelect = (len) => {
    // original color
    let color = '#d0d000'
    // over 3 reminder
    if (len > 3) {
        color = '#39c9bb'
    }
    // over 8 reminders
    if (len > 7) {
        color = '#dd6262'
    }

    return color
}

const colorResponse = () => {
    let data = markData()
    const {year, month, date} = currentHighlightTime()
    for (let d of data) {
        if( d.year === year && d.month === month && d.date === date ) {
            const active = e('.active')
            const svg = e('.icon-reminder', active)
            if (svg) {
                if (d.validCount === 0) {
                    svg.remove()
                } else {
                    const color = colorSelect(d.validCount)
                    svg.style.fill = color
                }
            } else {
                if (d.validCount !== 0){
                insertMark(active, d.validCount)
                }
            }
        }
    }
}

const insertMark = (container, len) => {
    const color = colorSelect(len)
    const t = `
      <svg class="icon icon-reminder"  fill=${color} height="20" style="text-align: center" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
      </svg>
    `
    const svg = e('.icon-reminder', container)
    if (svg === null) {
        container.insertAdjacentHTML('beforeend', t)
    }
}

const markData = () => {
    let globalData = __globalData
    const keys = Object.keys(globalData)
    let database = []
    keys.forEach( key => {
        let data = {}
        const date = new Date(Number(key))
        data.unixTime = key
        data.year = date.getFullYear()
        data.month = date.getMonth()
        data.date = date.getDate()
        validDatabase = validData(key)
        data.validCount = validDatabase.length
        database.push(data)
    })
    return database
}

const initMark = () => {
    let data = markData()

    const {year, month} = currentHighlightTime()
    const {dateContainer} = container()

    for (let d of data) {
       if( d.year === year && d.month === month ) {
           if (d.validCount !== 0) {
               let dateCell = dateContainer.children[d.date - 1]
               insertMark(dateCell, d.validCount)
           }

       }
    }
}

const divResponse = () => {
    const {todoContainer} = reminderContainer()
    const h = todoContainer.offsetHeight
    const {contentDateWrapper} = container()
    let wrapper = contentDateWrapper
    let box = e('.reminder-container')

    if (h > 215) {
        wrapper.style.marginTop = '-50px'
        wrapper.style.fontSize = '22px'

    } else {
        wrapper.style.marginTop = '50px'
        wrapper.style.fontSize = 'inherit'


    }
}

const ResponseByData = () => {
    colorResponse()
    divResponse()
}

