const { log, sortBy } = require('../utils.js')
const express = require('express')
const path = require('path')
const multer = require('multer')
const uploadPath = 'uploads/'

const upload = multer({
    dest: uploadPath,
})

const router = express.Router({mergeParams: true})

router.get('/', (req, res) => {
    res.render('video.html')
})

router.get('/src/:video', (req, res) => {
    let filename = req.params.video
    let p = uploadPath + filename
    p = path.resolve(p)
    res.sendFile(p)
})

module.exports = router