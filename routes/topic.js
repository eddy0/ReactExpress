const express = require('express')

const User = require('../models/user')
const Topic = require('../models/topic')
const Tag = require('../models/tag')
const { currentUser, loginRequired } = require('./main')

const router = express.Router()


router.get('/', loginRequired, async (request, response) => {
    response.redirect('../')
})


router.get('/new', loginRequired, async (request, response) => {
    const tags = await Tag.all()
    const args = {
        tags: tags
    }
    response.render('topic/new.html', args)
})
router.post('/add', loginRequired, async (request, response) => {
    const form = request.body
    const u = await currentUser(request)
    form.uid = u._id
    const t = await Topic.create(form)
    console.log('t', t)
    response.redirect('../')
})

router.get('/:id', loginRequired, async (request, response) => {
    const u = currentUser(request)
    const id = request.params.id
    const topic = await Topic.detail(id)
    const args = {
        u: u,
        t: topic,
    }
    response.render('topic/detail.html', args)
})






module.exports = router