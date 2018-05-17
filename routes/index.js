const { log, sortBy } = require('../utils.js')
const express = require('express')
const Topic = require('../models/topic.js')
const User = require('../models/user.js')
const Tag = require('../models/tag.js')
const Comment = require('../models/comment.js')
const { currentUser, loginRequired } = require('./main.js')

const router = express.Router()

router.get('/', async (req, res) => {
    log('client ip', req.headers['x-forwarded-for'] )
    let u = await currentUser(req)
    let tags = await Tag.all()
    let topics = await Topic.topicByUser(u)
    let args = {
        topics: topics.sort(sortBy('createdTime')),
        tags: tags,
        user: u
    }
    res.render('index.html', args)
})

router.get('/topic/tag/:tag', async (req, res) => {
    let tag = req.params.tag
    let u = await currentUser(req)
    let tags = await Tag.all()
    topics =  await Topic.all().filter( (topic) => {
        let tags = topic.tags
        return tags.includes(tag)
    })
    topics = await Topic.topicByUser(u, topics)
    args = {
        topics: topics.sort(sortBy('createdTime')),
        tags: tags,
        user: u
    }
    res.render('index.html', args)
})

router.get('/topic/new', loginRequired, async (req, res) => {
    let tags = await Tag.all()
    let args = {
        tags: tags,
    }
    res.render('new.html', args)
})

router.get('/topic/:id',  loginRequired, async (req, res) => {
    let id = req.params.id
    let u = await currentUser(req)
    let topic = await Topic.detail(u, id)

    if (topic !== null){
        let tags = await Tag.all()
        let author =  await topic.user()
        let comments = await Comment.commentByTopic(id)


        let args = {
            topic: topic,
            tags: tags,
            author: author,
            user: u,
            comments: comments.sort(sortBy('createdTime')),
        }
        res.render('detail.html', args)
    } else{
        res.status(404).send('not found')
    }
})

router.get('/signup', (req, res) => {
    let nextUrl = req.query.nextUrl || '/'
    res.render('signup.html', {
        nextUrl: nextUrl,
    })
})

router.post('/signup',  async (req, res) => {
    let form = req.body
    log('form', form)
    let u = await User.register(form)
    if (u !== null) {
        let nextUrl = form.nextUrl || '/'
        req.session.uid = u._id
        res.redirect(nextUrl)
    } else {
        req.session.flash = {
            message: 'invalid username and password'
        }
        res.redirect('/signup')
    }
})

router.get('/signin', (req, res) => {
    let nextUrl = req.query.nextUrl
    let args = {
        nextUrl: nextUrl || ''
    }
    res.render('signin.html', args )
})

router.post('/signin', async (req, res) => {
    let form = req.body
    let valid = await User.validLogin(form)
    if (valid) {
        let u = await User.findBy('username', form.username)
        req.session.uid = u._id
        let nextUrl = form.nextUrl || '/'
        res.status(200).redirect(nextUrl)
    } else {
        req.session.flash = {
            message: 'invalid username and password',
            nextUrl: form.nextUrl || '/',
        }
        res.redirect('/signin')
    }
})

router.get('/logout', (req, res) => {
    req.session = null
    res.redirect('/')
})



module.exports = router
