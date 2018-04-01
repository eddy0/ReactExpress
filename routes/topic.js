const express = require('express')

const router = express.Router()

const User = require('../models/user')
const { currentUser, loginRequired } = require('./main')



router.get('/', loginRequired, async (request, response) => {
    response.redirect('../')
})


router.get('/new', loginRequired, (request, response) => {
    response.render('topic/new.html')
})
router.post('/add', loginRequired, async (request, response) => {
    const body = request.body
    console.log('body', body)
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