
const User = require('../models/user')

const currentUser = async (request) => {
    const uid = request.session.uid
    if (uid === undefined) {
        return User.guest()
    } else {
        const u = await User.get(uid)
        if (u === null) {
            return User.guest()
        } else {
            return u
        }
    }
}


const loginRequired = async (request, response, next) => {
    const u = await currentUser(request)
    if (u.role !== -1) {
        next()
    } else{
        const baseUrl = '/login'
        if (request.method === 'POST') {
            response.redirect(baseUrl)
        } else {
            const next = baseUrl + '?next=' + request.originalUrl
            response.redirect(next)
        }
    }
}

module.exports = {
    loginRequired: loginRequired,
    currentUser: currentUser,
}