const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('cookie-session')
const nunjucks = require('nunjucks')

const app = express()

const configTemplate = () => {
    const env = nunjucks.configure('templates',{
        express: app,
        noCache: true,
        autoescape: true,
        watch: true,
    })

    env.addFilter('formattedTime', (date) => {
        const { formattedTime } = require('./filter/filter.js')
        const s = formattedTime(date)
        return s
    })

    env.addFilter('replace', (str) => {
        const { replace } = require('./filter/filter.js')
        const s = replace(str)
        return s
    })
}


const routesRegister = () => {
    // const api = require('/routes/api')
    // app.use('/api/', api)

    const index = require('./routes/index')
    app.use('/', index)

    const topic = require('./routes/topic')
    app.use('/topic', topic)
}

const configApp = () => {
    app.use(bodyParser.urlencoded({
        extended: true,
    }))

    app.use(bodyParser.json())

    app.use(session({
        secret: 'key',
    }))

    const asset = path.join(__dirname, 'static')
    app.use('/static', express.static(asset))

    app.use( (request, response, next) => {
        response.locals.flash = request.session.flash
        delete request.session.flash
        next()
    })

    configTemplate()

    routesRegister()
}

const run = (port=3000, host) => {
    const server = app.listen(port, host, () => {
        const address = server.address()
        console.log(`listening to http://${address.address}:${address.port}`)
    })
}

if (require.main === module) {
    configApp()
    const port = 5000
    const host = '0.0.0.0'
    run(port, host)
}