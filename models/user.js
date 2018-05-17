const { log } = require('../utils.js')
const {mongoose, Model} = require('./main')
const crypto = require('crypto')

const Schema = mongoose.Schema
const userSchema = new Schema({
    username: String,
    nickname: {
        type: String,
    },
    password: String,
    email: String,
    note: {
        type: String,
        default: 'nothing is writing',
    },
    avatar: {
        type: String,
        default: 'default.png',

    },
    role: {
        type: Number,
        default: 2,
    },
    score: {
        type: Number,
        default: 0,
    },
    createdTime: {
        type: Number,
        default: Date.now()
    },
    updatedTime: {
        type: Number,
        default: Date.now(),
    },
    introduction: String,
})


class UserStore extends Model{
    static async create(form) {
        form.nickname = form.nickname || form.username
        form.password = this.saltedPassword(form.password)
        const u = await super.create(form)
        return u
    }

    static async publicInfo(id) {
        let user = await User.get(id)
        if (user === null) {
            return user
        } else {
            let authedKey = [
                '_id',
                'username',
                'nickname',
                'score',
                'createdTime',
                'note',
            ]
            let u = {}
            for (let key in user ) {
                if (authedKey.includes(key)) {
                    u[key] = user[key]
                }
            }
            return u
        }
    }

    static saltedPassword(password, salt='123') {
        const pwd = password + salt
        const hash = crypto.createHash('sha256')
        hash.update(pwd)
        const h = hash.digest('hex')
        return h
    }

    static async validLogin(form) {
        const {username, password} = form
        const u = await super.findBy('username', username)
        return u !== null && u.password === this.saltedPassword(password)
    }

    static async register(form) {
        const {username, password} = form
        const validForm = username.length >= 3 && password.length >= 3
        const uniqueUser = await super.findBy('username', username) === null
        if (uniqueUser && validForm) {
            const u = await this.create(form)
            return u
        } else {
            return null
        }
    }

    isAdmin() {
        return this.role === 1
    }

    static guest() {
        const o = {
            _id: 0,
            username: 'guest',
            role: -1,
            note: 'this is a guest'
        }
        const u = new User(o)
        return u
    }
}

userSchema.loadClass(UserStore)
const User = mongoose.model('User', userSchema)


module.exports = User

