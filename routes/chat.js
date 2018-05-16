const { log } = require('../utils.js')

const express = require('express')
const Chat = require('../models/chat')
const User = require('../models/user')
const router = express.Router()
const { currentUser, loginRequired } = require('./main')
const { calendarDate, localeDate } = require('../filter')



router.get('/', loginRequired, (req, res) => {
    let u = currentUser(req)
    let chats = Chat.all()
    chats = chats.filter((chat) => {
        let content = chat.content.trim()
        return content.length > 0
    })
    chats.forEach((chat) => {
        let user = User.get(chat.uid)
        chat.user = user
        chat.date = localeDate(chat.date)
    })

    let args = {
        user: u,
        chats: chats,
    }

    req.io.on('connection', function (socket) {
        log('socket.id', socket.id)
        let form = {
            socketId: socket.id,
            uid: u._id,
        }
        let data = Chat.create(form)
        socket.broadcast.emit('new', data)
    })


    res.render('chat.html',  args)
})

router.post('/api/add', (req, res) => {
    let content = req.body.content
    let t = req.body.date
    let u = currentUser(req)
    let args = {
        user: u,
        content: content,
        date: t
    }
    let form = {
        uid: u._id,
        date: t,
        content: content,
    }
    Chat.create(form)
    req.io.emit('message', args )
    res.json({success:true})
})

router.put('/delete',  (req, res) => {
    let id = Number(form.id)
    let data = {
        id: id,
    }
    io.on('connection', function(socket){
        socket.on('disconnect', function(){
            console.log(socket.id)
        })
    })

    socket.broadcast.emit('disconnect', data)
    res.json({success:true})
})



module.exports = router