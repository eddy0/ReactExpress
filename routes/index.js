const express = require('express')
const User = require('../models/user')
const Topic = require('../models/topic')
const {rank} = require('../utils')
const { currentUser, loginRequired } = require('./main')
const router = express.Router()

router.get('/', loginRequired, async (request, response) => {
    const u = await currentUser(request)
    let ts = await Topic.allList()
    ts = ts.sort(rank('createdTime'))
    console.log('u', u)
    const args = {
        u: u,
        topics: ts,
    }
    response.render('redo/index.html', args)
})


router.get('/login', (request, response) => {
    response.render('login.html')
})

router.post('/login', async (request, response) => {
    const next= request.query.next || '/'
    const form = request.body
    console.log('request, ',  request.query, request.body)
    const exist = await User.validLogin(form)
    if (exist) {
        const u = await User.findBy('username', form.username)
        request.session.uid = u._id
        response.redirect(next)
    } else {
        request.session.flash = {
            message: 'username or password is not valid'
        }
        response.redirect(`/login?next=${next}`)
    }

})

router.get('/register', (request, response) => {
    response.render('signup.html')
})

router.post('/register', async (request, response) => {
    const next= request.query.next || '/'
    const form = request.body
    const u = await User.register(form)
    console.log('u', u)
    if (u === null) {
        request.session.flash = {
            message: "username already exist"
        }
        response.redirect(`/register?next=${next}`)
    } else {
        response.redirect(next)
    }
})

router.get('/logout', async (request, response) => {
    request.session = null
    response.redirect('/')
})


module.exports = router