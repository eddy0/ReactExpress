const { log, sortBy } = require('../utils.js')
const { formattedTime } = require('../filter.js')
const express = require('express')
const Topic = require('../models/topic.js')
const User = require('../models/user.js')
const Comment = require('../models/comment.js')
const { currentUser, loginRequired, ajaxloginRequired
} = require('./main.js')

const router = express.Router()


router.post('/reply', (req, res) => {
    let form = req.body
    let u = currentUser(req)
    form.topicId = Number(form.topicId)
    form.uid = u._id
    let comment = Comment.create(form)
    comment.isAuthor = comment.isAuthor()
    comment.replyToAuthor = comment.replyTo()
    comment.user = u
    comment.createdTime = formattedTime(comment.createdTime)
    Topic.comment(u._id, form.topicId)
    let args = {
        success: true,
        message: '',
        data: comment,
    }
    res.json(args)
})

router.post('/add', (req, res) => {
    let url = req.headers.referer.split('?')[0]
    let topicId = Number(url.split('/').slice(-1)[0])
    let form = req.body
    let u = currentUser(req)
    form.topicId = topicId
    form.uid = u._id
    let comment = Comment.create(form)
    comment.isAuthor = comment.isAuthor()
    comment.user = u
    comment.createdTime = formattedTime(comment.createdTime)
    Topic.comment(u._id, topicId)
    let args = {
        success: true,
        message: '',
        data: comment,
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
