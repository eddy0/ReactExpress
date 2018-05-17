const { log } = require('../utils.js')
const express = require('express')
const path = require('path')
const multer = require('multer')
const uploadPath = 'uploads/'

const upload = multer({
    dest: uploadPath,
    limits: {fileSize: 2048000},
})

const Topic = require('../models/topic.js')
const User = require('../models/user.js')
const Tag = require('../models/tag.js')
const Comment = require('../models/comment.js')
const { currentUser, loginRequired } = require('./main.js')
const { calendarDate } = require('../filter.js')
const { sortBy } = require('../utils.js')

const router = express.Router({mergeParams: true})

router.post('/upload/avatar', loginRequired,  (req, res) => {
    let uploadFilter = upload.single('avatar')
    let args
    uploadFilter(req, res, (error) => {
        if (error) {
            args = {
                message: 'the file was too big',
                success: false,
                data: [],
            }
        } else {
            const avatar = req.file
            args = {
                message: '',
                success: true,
                data: avatar.filename,
            }
            let type = ['image/png','image/jpeg', 'image/gif' ]
            if (!type.includes(avatar.mimetype)) {
                args = {
                    message: 'only png/jpeg/gif type are allowed',
                    success: false,
                    data: [],
                }
            }
        }
        res.json(args)
    })
})

router.post('/setting', loginRequired,  async (req, res) => {
    let form = req.body
    let u = await currentUser(req)
    u = Object.assign(u, form)
    u.save()
    let args = {
        message: '',
        success: true,
        data: u,
    }
    res.json(args)
})

router.get('/:uid/topic', loginRequired, async (req, res) => {
    let id = req.params.uid
    let user = await User.publicInfo(id)
    if (user !== null) {
        let topics = await Topic.allList(user._id.toString())
        user.createdTime = calendarDate(user.createdTime)
        let args = {
            success: true,
            message: '',
            data: topics.sort(sortBy('createdTime')),
        }
        res.json(args)
    } else {
        let args = {
            success: false,
            message: "can't found",
            data: [],
        }
        res.json(args)
    }
})

router.get('/:uid/comment', loginRequired, async (req, res) => {
    let id = req.params.uid
    let user = await User.publicInfo(id)
    if (user !== null) {
        user.createdTime = calendarDate(user.createdTime)
        let comments = await Comment.allList(user._id)
        let args = {
            success: true,
            message: '',
            data: comments.sort(sortBy('createdTime')),
        }
        res.json(args)
    } else {
        let args = {
            success: false,
            message: "can't found",
            data: [],
        }
        res.json(args)
    }
})

router.get('/:uid/bookmark', loginRequired, async (req, res) => {
    let u = await currentUser(req)
    let id = req.params.uid
    let user = await User.publicInfo(id)
    if (user !== null) {
        user.createdTime = calendarDate(user.createdTime)
        let topics = await Topic.topicByActions(user._id.toString(), 'marks')
        let args = {
            success: true,
            message: '',
            data: topics.sort(sortBy('createdTime')),
        }
        res.json(args)
    } else {
        let args = {
            success: false,
            message: "can't found",
            data: [],
        }
        res.json(args)
    }
})

router.get('/:uid/star', loginRequired,  async (req, res) => {
    let u = await currentUser(req)
    let id = req.params.uid
    let user = await User.publicInfo(id)
    if (user !== null) {
        user.createdTime = calendarDate(user.createdTime)
        let topics = await Topic.topicByActions(user._id.toString(), 'stars')
        let args = {
            success: true,
            message: '',
            data: topics.sort(sortBy('createdTime')),
        }
        res.json(args)
    } else {
        let args = {
            success: false,
            message: "can't found",
            data: [],
        }
        res.json(args)
    }
})




module.exports = router
