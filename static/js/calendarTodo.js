
// init highlight year
const initYear = (year, yearContainer) => {
    yearContainer.innerHTML = year
}
// init highlight month
const initMonth = (month,monthContainer) => {
    const ms = er('.month-detail',  monthContainer)
    for (let i = 0; i < ms.length; i++) {
        if (ms[i].classList.contains('selected')) {
            ms[i].classList.remove('selected')
        }
        const index = ms[i].dataset.month
        if (index === String(month)) {
            ms[i].classList.add('selected')
        }
    }
}

const initDate = (year, month, date) => {
    // date map, how many days in current month & year and the day for the first month
    mapUpdate(year, month, date)
}

const initCalendar = (year, month, date) => {
    // type number
    const {yearContainer, monthContainer} = container()
    // init highlighted year
    initYear(year, yearContainer)
    // init highlighted month
    initMonth(month,monthContainer)
    // init highlighted date
    initDate(year, month, date)
}

const initReminder = () => {

    // init reminder content
    contentUpdate()
    // load data
    loadReminderData()
}

const init = () => {
    const {year, month, date} = formattedTime()
    reload(year, month, date)
}

const reload = (year, month, date) => {

    initCalendar(year, month, date)

    initReminder()

    initMark()

    ResponseByData()
}

const __main = () => {
    loadFile()
    init()
    dateEvents()
    todoEvent()

}

__main()
