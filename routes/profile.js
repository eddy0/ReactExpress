const { log } = require('../utils.js')
const express = require('express')
const Topic = require('../models/topic.js')
const User = require('../models/user.js')
const Tag = require('../models/tag.js')
const { currentUser, loginRequired } = require('./main.js')

const router = express.Router()

router.get('/', loginRequired, async (req, res) => {
    let u = await currentUser(req)
    let topics = await Topic.findAll('uid', u.id)
    args = {
        topics: topics,
        user: u
    }
    res.render('setting.html', args)
})

router.get('/', async (req, res) => {
    let tags = await Tag.all()
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
