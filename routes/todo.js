const { log, sortBy } = require('../utils.js')
const express = require('express')
const Topic = require('../models/topic.js')
const User = require('../models/user.js')
const Tag = require('../models/tag.js')
const Comment = require('../models/comment.js')
const { currentUser, loginRequired } = require('./main.js')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('todo.html')
})


module.exports = router
