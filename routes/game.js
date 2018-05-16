const { log, sortBy } = require('../utils.js')
const express = require('express')

const router = express.Router({mergeParams: true})

router.get('/', (req, res) => {
    res.render('game.html')
})


module.exports = router