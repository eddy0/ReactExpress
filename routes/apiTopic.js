const { log } = require('../utils.js')
const express = require('express')
const Topic = require('../models/topic.js')
const { currentUser, ajaxloginRequired } = require('./main.js')

const router = express.Router()

router.get('/full/:id', async (req, res) => {
    let id = req.params.id
    let t = await Topic.get(id)
    let args = {
        success: true,
        message: '',
        data: t.content,
    }
    res.json(args)
})

router.get('/brief/:id', async (req, res) => {
    let id = req.params.id
    let t = await Topic.get(id)
    let args = {
        success: true,
        message: '',
        data: t.brief,
    }
    res.json(args)
})

const responseByAction = async (u, topic, action) => {
    let args
    if (topic !== null) {
        topic = await topic.action(u, action)
        log(topic)
        args = {
            success: true,
            message: '',
            data: topic[action].length,
        }
    } else {
        args = {
            success: false,
            message: 'wrong',
            data: [],
        }
    }
    return args
}

router.post('/star', ajaxloginRequired, async (req, res) => {
    const form = req.body
    const u = await currentUser(req)
    let topic = await Topic.get(form.id)
    let args = await responseByAction(u, topic, 'stars')
    res.json(args)
})

router.post('/mark', ajaxloginRequired, async (req, res) => {
    const form = req.body
    const u = await currentUser(req)
    let topic = await Topic.get(form.id)
    let args = await responseByAction(u, topic, 'marks')
    res.json(args)
})

router.post('/new', ajaxloginRequired, async (req, res) => {
    const form = req.body
    const u = await currentUser(req)
    form.uid = u._id
    let m = Topic.create(form)
    let args = {
        success: true,
        message: '',
        data: m
    }
    args.data.next = `${ req.protocol}://${req.headers.Host}`
    res.json(args)
})



module.exports = router
