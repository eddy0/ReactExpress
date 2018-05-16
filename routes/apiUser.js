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

const uploadFilter = (req, res, next) => {
    let file = upload.single('avatar')
    let args
    file(req, res, (error) => {
        if (error) {
            console.log('error',error)
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
        }
        res.json(args)
    })
}

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

router.post('/setting', loginRequired,  (req, res) => {
    let form = req.body
    log(req.body)
    let u = currentUser(req)
    u = Object.assign(u, form)
    u.save()
    let args = {
        message: '',
        success: true,
        data: u,
    }
    res.json(args)
})

router.get('/:uid/topic', loginRequired, (req, res) => {
    let id = Number(req.params.uid)
    let user = User.get(id)
    log('user',req.params.uid, id, user)
    if (user !== null) {
        let topics = Topic.all()
        topics = topics.filter( (topic) => {
            return topic.uid === user._id
        })
        topics.forEach( (topic) => {
            topic.createdTime = calendarDate(topic.createdTime)
        })
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

router.get('/:uid/comment', loginRequired, (req, res) => {
    let u = currentUser(req)
    let id = Number(req.params.uid)
    let user = User.get(id)
    if (user !== null) {
        let comments = Comment.all()
        comments = comments.filter( (comment) => {
            return comment.uid === user._id
        })
        comments.forEach( (comment) => {
            comment.author = User.get(comment.uid)
            comment.topic = Topic.get(comment.topicId)
            // comment.createdTime = calendarDate(comment.createdTime)
        })
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

router.get('/:uid/bookmark', loginRequired, (req, res) => {
    let id = Number(req.params.uid)
    let user = User.get(id)
    if (user !== null) {
        let topics = Topic.all()
        topics = topics.filter( (topic) => {
            return topic.marked.includes(user._id)
        })
        topics.forEach( (topic) => {
            topic.createdTime = calendarDate(topic.createdTime)
        })

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

router.get('/:uid/star', loginRequired, (req, res) => {
    let id = Number(req.params.uid)
    let user = User.get(id)
    if (user !== null) {
        let topics = Topic.all()
        topics = topics.filter( (topic) => {
            return topic.starred.includes(user._id)
        })
        topics.forEach( (topic) => {
            topic.createdTime = calendarDate(topic.createdTime)
        })

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
