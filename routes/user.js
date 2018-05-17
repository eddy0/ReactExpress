const { log, sortBy } = require('../utils.js')
const express = require('express')
const path = require('path')
const multer = require('multer')
const uploadPath = 'uploads/'
const { calendarDate } = require('../filter')

const upload = multer({
    dest: uploadPath,
})

const Topic = require('../models/topic.js')
const User = require('../models/user.js')
const Comment = require('../models/comment.js')
const Tag = require('../models/tag.js')
const { currentUser, loginRequired } = require('./main.js')

const router = express.Router({mergeParams: true})

router.get('/setting', loginRequired, async (req, res) => {
    let u = await currentUser(req)
    let topics = Topic.findAll('uid', u._id)
    let args = {
        topics: topics,
        user: u
    }
    res.render('setting.html', args)
})

router.get('/:uid', loginRequired, (req, res) => {
    let uid = req.params.uid
    res.redirect(`/user/${uid}/topic`)
})


router.get('/:uid/topic', loginRequired, async(req, res) => {
    let u = await currentUser(req)
    let id = req.params.uid
    let user = await User.publicInfo(id)
    if (user !== null) {
        let topics = await Topic.allList(user._id.toString())
        user.createdTime = calendarDate(user.createdTime)
        let  args = {
            topics: topics.sort(sortBy('createdTime')),
            filteredUser: user,
            user: u,
        }
        res.render('profile.html', args)
    } else {
        res.status(404).send('not found')
    }
})

router.get('/:uid/comment', loginRequired,  async (req, res) => {
    let u = await currentUser(req)
    let id = req.params.uid
    let user = await User.publicInfo(id)
    if (user !== null) {
        user.createdTime = calendarDate(user.createdTime)
        let comments = await Comment.allList(user._id)
        let  args = {
            comments: comments.sort(sortBy('createdTime')),
            filteredUser: user,
            user: u,
        }
        res.render('profile_comment.html', args)
    } else {
        res.status(404).send('not found')
    }
})

router.get('/:uid/bookmark', loginRequired, async (req, res) => {
    let u = await currentUser(req)
    let id = req.params.uid
    let user = await User.publicInfo(id)
    if (user !== null) {
        user.createdTime = calendarDate(user.createdTime)
        let topics = await Topic.topicByActions(user._id.toString(), 'marks')
        let  args = {
            topics: topics.sort(sortBy('createdTime')),
            filteredUser: user,
            user: u,
        }
        res.render('profile_bookmark.html', args)
    } else {
        res.status(404).send('not found')
    }
})

router.get('/:uid/star', loginRequired, async (req, res) => {
    let u = await currentUser(req)
    let id = req.params.uid
    let user = await User.publicInfo(id)
    if (user !== null) {
        user.createdTime = calendarDate(user.createdTime)
        let topics = await Topic.topicByActions(user._id.toString(), 'stars')
        let args = {
            topics: topics.sort(sortBy('createdTime')),
            filteredUser: user,
            user: u,
        }
        res.render('profile_star.html', args)
    } else {
        res.status(404).send('not found')
    }
})

router.get('/avatar/:avatar', (req, res) => {
    let filename = req.params.avatar
    let p = uploadPath + filename
    p = path.resolve(p)
    res.sendFile(p)
})

router.post('/upload/avatar', loginRequired, upload.single('avatar'),  (req, res) => {
    const u = currentUser(req)
    const avatar = req.file
    u.avatar = avatar.filename
    u.save()
    res.redirect(`/user/setting`)
})



module.exports = router
