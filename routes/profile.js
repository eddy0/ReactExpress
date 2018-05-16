const { log } = require('../utils.js')
const express = require('express')
const Topic = require('../models/topic.js')
const User = require('../models/user.js')
const Tag = require('../models/tag.js')
const { currentUser, loginRequired } = require('./main.js')

const router = express.Router()

router.get('/', loginRequired, (req, res) => {
    let u = currentUser(req)
    let topics = Topic.all()
    topics = topics.filter( (topic) => {
        return topic.uid === u._id
    })
    args = {
        topics: topics,
        user: u
    }
    res.render('setting.html', args)
})

router.get('/', (req, res) => {
    let tags = Tag.all()
    let args = {
        tags: tags,
    }
    res.render('new.html', args)
})

router.get('/:id',  loginRequired, (req, res) => {
    let id = Number(req.params.id)
    let u = currentUser(req)
    let topic = Topic.detail(u, id)
    let author = User.get(topic.uid)
    log('author', author)
    let tags = Tag.all()
    if (topic !== null){
        args = {
            topic: topic,
            tags: tags,
            author: author,
            user: u,
        }
        res.render('detail.html', args)
    } else{
        res.status(404).send('not found')
    }
})



module.exports = router
