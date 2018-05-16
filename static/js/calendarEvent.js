const container = () => {
    const yearContainer = e('.currentYear')
    const monthContainer = e('.month-lists')
    const dateContainer = e('.date-lists')
    const contentYearContainer = e('.content-year')
    const contentMonthContainer = e('.content-month')
    const contentDateContainer = e('.content-date')
    const contentDayContainer = e('.content-day')
    const contentDateWrapper = e('.date-wrapper')
    return {
        yearContainer,
        monthContainer,
        dateContainer,
        contentYearContainer,
        contentMonthContainer,
        contentDateContainer,
        contentDayContainer,
        contentDateWrapper,
    }
}

const currentHighlightTime = () => {
    const {yearContainer, monthContainer, dateContainer} = container()
    //current year
    const selectedYear = yearContainer.innerText
    //current month
    const selectedMonth = e('.selected', monthContainer).dataset.month
    // current date
    const selectedDate = e('.active', dateContainer).innerText
    const year = Number(selectedYear)
    const month =  Number(selectedMonth)
    const date =  Number(selectedDate)
    // current date

    const day = new Date(year, month, date).getDay()

    return {year, month, date, day}
}

const dateUpdate = () => {
    const {year, month, date} = currentHighlightTime()
    // calendar date update
    mapUpdate(year, month, date)
    // reminder date update
    contentUpdate()
}

const yearEvent = () => {
    const {yearContainer} = container()

    const pre = e('.previous')
    pre.addEventListener('click', () => {
        let {year, month, date} = currentHighlightTime()
        year -= 1
        yearContainer.innerText = year

        reload(year, month, date)

    })

    const next = e('.next')
    next.addEventListener('click', () => {
        let {year, month, date} = currentHighlightTime()
        year += 1
        yearContainer.innerText = year

        reload(year, month, date)

    })
}

const monthEvent = () => {
    const {monthContainer} = container()

    const m = monthContainer
    m.addEventListener('click', (event) => {
        // highlight date update
        const target = event.target
        const sel = e('.selected', m)
        sel.classList.remove('selected')
        target.classList.add('selected')

        dateUpdate()

        // load new data
        loadReminderData()

        initMark()

        // update reminder mark
        ResponseByData()

    })
}

const dateEvent = () => {
    const dateContainer = e('.date-lists')

    dateContainer.addEventListener('click', (event) => {
        const target = event.target
        const p = target.parentElement
        const list = p.classList.contains('date-lists') || p.parentElement.classList.contains('date-lists')
        if (list) {
            // highlight date update
            const sel = target.closest('.current-dateList')
            const activedElement = e('.active', dateContainer)
            if (activedElement !== null) {
                activedElement.classList.remove('active')
            }
            sel.classList.add('active')

            // reminder date update
            contentUpdate()

            // data update
            loadReminderData()

            // insertRemindermark()
            ResponseByData()

        }
    })
}

const dateTemplate = (dateCount, weekday) => {
    let ts = `
             <li class="current-dateList" style="margin-left: ${71.42 * weekday}px">
                 <span class="current-date">1</span>
             </li>\n
             `
    for (let i = 2; i <= dateCount ; i++) {
        let t = `
                <li class="current-dateList">
                    <span class="current-date">${i}</span>
                </li>
               `
        /*
         <svg class="icon icon-reminder" fill="#000" height="20" style="text-align: center" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>


         */
        ts += t
    }
    return ts
}

const insertDateTemplate = (dateCount, day) => {
    const {dateContainer} = container()
    dateContainer.innerHTML = ''
    const  t = dateTemplate(dateCount, day)
    dateContainer.insertAdjacentHTML('beforeend', t )
}

const daysMapper = (year, month) => {
    let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (year % 100 === 0 && year % 400 === 0) {
        days[1] = 29
    }
    if (year % 100 !== 0 && year % 4 === 0) {
        days[1] = 29
    }
    const dayCountByMonth = days[month]

    // type number
    const firstDay = new Date(year, month, 1)
    const firstDayByMonth = firstDay.getDay()
    return {dayCountByMonth, firstDayByMonth}
}

const highlightUpdate = (date) => {
    const {dateContainer} = container()
    const dateCount = dateContainer.children.length
    let index = date
    if (index > dateCount) {
        index = dateCount
    }
    dateContainer.children[index - 1].classList.add('active')
}

const mapUpdate = (year, month, date) => {
    const {dayCountByMonth, firstDayByMonth} = daysMapper(year, month)
    insertDateTemplate(dayCountByMonth, firstDayByMonth, date)
    highlightUpdate(date)
}

const contentYearUpdate = () => {
    let {year} = currentHighlightTime()
    const {contentYearContainer} = container()
    contentYearContainer.innerText = year
}

const contentMonthUpdate = () => {
    const monthMap = {
        0: 'JANUARY',
        1: 'FEBURARY',
        2: 'MARCH',
        3: 'APRIL',
        4: 'MAY',
        5: 'JUNE',
        6: 'JULY',
        7: 'AUGUST',
        8: 'SEPTEMBER',
        9: 'OCTOBER',
        10: 'NOVEMBER',
        11: 'DECEMBER',
    }
    const {contentMonthContainer} = container()
    const {month} = currentHighlightTime()
    contentMonthContainer.innerHTML = monthMap[month]
}

const contentDateUpdate = () => {
    const dateMap = {
        1: 'ST',
        2: 'ND',
        3: 'ST'
    }

    const {date} = currentHighlightTime()
    let orderedDate = (date in dateMap)? `${date}${dateMap[date]}`: `${date}TH`
    const {contentDateContainer} = container()
    contentDateContainer.innerText = orderedDate

}

const contentDayUpdate = () => {
    const dayMap = {
        0: 'SUNDAY',
        1: 'MONDAY',
        2: 'TUESDAY',
        3: 'WEDNESDAY',
        4: 'THURSDAY',
        5: 'FRIDAY',
        6: 'SATURDAY',
    }
    const {day} = currentHighlightTime()
    const {contentDayContainer} = container()
    contentDayContainer.innerHTML = dayMap[day]
}

const calendarEvents = () => {
    yearEvent()
    monthEvent()
    dateEvent()
}

const contentUpdate = () => {
    contentYearUpdate()
    contentMonthUpdate()
    contentDateUpdate()
    contentDayUpdate()
}

const dateEvents = () => {
    calendarEvents()
    contentUpdate()
}






