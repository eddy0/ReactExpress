const { log } = require('../utils.js')
const User = require('../models/user.js')


const currentUser = async (request) => {
    let uid = request.session.uid
    if (uid === undefined) {
        return User.guest()
    } else {
        let u = await User.get(uid)
        if (u === null) {
            return User.guest()
        } else {
            return u
        }
    }
}

const ajaxloginRequired = async (req, res, next) => {
    const u = await currentUser(req)
    if (u._id === 0) {
       let args = {
           success: false,
           message: 'please login in',
           data: []
       }
       res.json(args)
    } else {
        next()
    }
}

const loginRequired = async (req, res, next) => {
    const u = await currentUser(req)
    if (u.role === -1){
        let baseUrl = '/signin'
        if (req.method === 'POST'){
            res.redirect(baseUrl)
        } else {
            let original = req.originalUrl
            let nextUrl = baseUrl + '?nextUrl='+ original
            res.redirect(nextUrl)
        }
    } else {
        next()
    }
}

module.exports = {
    currentUser: currentUser,
    loginRequired: loginRequired,
    ajaxloginRequired: ajaxloginRequired,
}