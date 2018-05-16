const { log } = require('../../utils.js')
const express = require('express')
const User = require('../../models/user.js')

const router = express.Router()

router.post('/signin', (req, res) => {
    const form = req.body
    let valid = User.validLogin(form)
    let args
    if (valid) {
        let u = User.findBy('username', form.username)
        req.session.uid = u._id
        args = {
            success: true,
            message: '',
            data: u
        }
    } else {
        args = {
            success: false,
            message: 'wrong username and password',
            data: []
        }
    }
    res.json(args)
})

router.get('/logout', (req, res) => {
    req.session = null
    let args = {
        success: true,
        message: 'logged out',
        data: []
    }
    res.json(args)
})

router.post('/signup', (req, res) => {
    const form = req.body
    log('form', form)

    res.render('signup.html')
})

router.post('/signup/valid', (req, res) => {
    let form = req.body
    let valid = User.findBy('username', form.username) === null
    let args = {
        success: true,
        message: 'you can use this username',
        data: []
    }
    if (!valid){
        args.success = false
        args.message = 'username exists'
    }
    res.json(args)
})




module.exports = router
