const { log } = require('./utils.js')

const express = require('express')
const http = require('http')
const socket = require('socket.io')
const bodyParser = require('body-parser')
const session = require('express-session')
const nunjucks = require('nunjucks')
const path = require('path')
const RedisStore = require('connect-redis')(session)


const app = express()


const configTemplate = () => {
    const env = nunjucks.configure('templates', {
        express: app,
        noCache: true,
        autoescape: true,
        watch: true,
    })

    env.addFilter('formattedTime', (date) => {
        let { formattedTime } = require('./filter.js')
        let f = formattedTime(date)
        return f
    })

    env.addFilter('calendarDate', (date) => {
        let { calendarDate } = require('./filter.js')
        let f = calendarDate(date)
        return f
    })

    env.addFilter('localeDate', (date) => {
        let { localeDate } = require('./filter.js')
        let f = localeDate(date)
        return f
    })
}

const registerRouter = () => {
    const index = require('./routes/index.js')
    app.use('/', index)

    const apiSign = require('./routes/api/sign.js')
    app.use('/api/', apiSign)

    const profile = require('./routes/profile.js')
    app.use('/setting', profile)

    const user = require('./routes/user.js')
    app.use('/user', user)

    const todo = require('./routes/todo.js')
    app.use('/todo', todo)

    const video = require('./routes/video.js')
    app.use('/video', video)

    const game = require('./routes/game.js')
    app.use('/game', game)

    const apiTopic = require('./routes/apiTopic.js')
    app.use('/api/topic/', apiTopic)

    const apiComment = require('./routes/apiComment.js')
    app.use('/api/comment/', apiComment)
    //
    const apiUser = require('./routes/apiUser.js')
    app.use('/api/user/', apiUser)
}

const configApp = () => {
    app.use(bodyParser.urlencoded({
        extended: true
    }))

    app.use(bodyParser.json())

    app.use(session({
        secret: 'key',
        store: new RedisStore(),
        resave: false,
        saveUninitialized: false,
        }
    ))

    app.use((req, res, next)=> {
        res.locals.flash = req.session.flash
        delete req.session.flash
        next()
    })

    app.use('/static', express.static(path.join(__dirname, 'static')))

    configTemplate()

    registerRouter()
}


// const run = (port=3000, host) => {
//     const server = app.listen(port, host, () => {
//         const address = server.address()
//         log('app listening', `http://localhost:${address.port}`)
//     })
// }


const configIO = (server) => {
    let io = require('socket.io').listen(server)

    app.use( (req, res, next) => {
        req.io = io
        next()
    })

    io.on('connection', function(socket) {
        let clients = Object.keys(io.sockets.sockets)
        console.log(clients.length, " clients are connected");
        console.log(socket.id)
        socket.emit('total', clients.length)
        socket.on('disconnect', function() {

            let clients = Object.keys(io.sockets.sockets)
            console.log(clients.length, " clients disconnected")
            console.log(socket.id)
            socket.emit('total', clients.length)

            // let socketId = socket.id
            // let Chat = require('./models/chat')
            // let u = Chat.findBy('socketId', socketId)
            // // log('u', u)
            // if (u !== null) {
            //     let id = u.uid
            //     socket.broadcast.emit('delete', id)
            // }

        })
    })


    const chat = require('./routes/chat.js')
    app.use('/chat', chat)



    //
    // io.on('connection', function(socket){
    //     socket.broadcast.emit('hi', '')
    // })

}

const run = (port=3000, host) => {
    const server = app.listen(port, host, () => {
        const address = server.address()
        log('app listening', `http://localhost:${address.port}`)
    })
    return server

}



if (require.main === module){
    configApp()
    let host = '0.0.0.0'
    let port = 7000
    let server = run(port, host )
    configIO(server)
}
