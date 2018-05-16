const { log } = require('../utils.js')
const express = require('express')
const Topic = require('../models/topic.js')
const User = require('../models/user.js')
const Tag = require('../models/tag.js')
const { currentUser, loginRequired, ajaxloginRequired
} = require('./main.js')

const router = express.Router()


router.post('/', (req, res) => {
    res.redirect('/')
})

router.get('/full/:id',  (req, res) => {
    let id = Number(req.params.id)
    let t = Topic.get(id)
    let args = {
        success: true,
        message: '',
        data: t.content,
    }
    res.json(args)
})

router.get('/brief/:id',  (req, res) => {
    let id = Number(req.params.id)
    let t = Topic.get(id)
    let args = {
        success: true,
        message: '',
        data: t.brief,
    }
    res.json(args)
})


router.post('/star', ajaxloginRequired, (req, res) => {
    const form = req.body
    const u = currentUser(req)
    let id = Number(form.id)
    let topic = Topic.get(id)
    let args
    if (topic !== null) {
        let member = topic.starred
        let index = member.findIndex( (m) => {
            return m === u._id
        })
        if (index > -1) {
            topic.starred.splice(index, 1)
            topic.stars --
        } else {
            topic.starred.push(u._id)
            topic.stars ++
        }
        topic.save()
        args = {
            success: true,
            message: '',
            data: topic.stars,
        }
    } else {
        args = {
            success: false,
            message: 'wrong',
            data: [],
        }
    }
    res.json(args)
})

router.post('/mark', ajaxloginRequired, (req, res) => {
    const form = req.body
    const u = currentUser(req)
    let args
        let id = Number(form.id)
        let topic = Topic.get(id)
        if (topic !== null) {
            let member = topic.marked
            let index = member.findIndex((m) => {
                return m === u._id
            })

            if (index > -1) {
                topic.marked.splice(index, 1)
                topic.marks--
            } else {
                topic.marked.push(u._id)
                topic.marks++
            }
            topic.save()
            args = {
                success: true,
                message: '',
                data: topic.marks,
            }
        } else {
            args = {
                success: false,
                message: 'wrong',
                data: [],
            }
        }
        res.json(args)
})


router.post('/new', ajaxloginRequired, (req, res) => {
    const form = req.body
    const u = currentUser(req)
    form.author = u
    form.uid = u._id
    let m = Topic.create(form)
    log('form', form)
    let args = {
        success: true,
        message: '',
        data: m
    }
    res.json(args)
})




module.exports = router
