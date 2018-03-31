const {mongoose, Model} = require('./main')
const crypto = require('crypto')

const Schema = mongoose.Schema
const userSchema = new Schema({
    username: String,
    password: String,
    note: {
        type: String,
        default: 'nothing is possible',
    },
    role: {
        type: Number,
        default: 2,
    },
    createdTime: {
        type: Number,
        default: Date.now()
    },
    updatedTime: {
        type: Number,
        default: Date.now(),
    },
    __deleted: {
        type: Boolean,
        default: false,
    }

})


class UserStore extends Model{
    static async create(form) {
        form.password = this.saltedPassword(form.password)
        const u = await super.create(form)
        return u
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
        console.log('username', username)
        console.log('password', password)
        const validForm = username.length > 2 && password.length > 2
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
        const form = {
            _id: 0,
            username: 'guest',
            role: -1,
            note: 'this is a guest'
        }
        const u = new User(form)
        return u
    }

}

userSchema.loadClass(UserStore)
const User = mongoose.model('User', userSchema)

const test = async () => {
    const form = {
        username: 'eddy',
        password: '123',
        note: 'test',
    }
    const query = {
        username: 'ook',
    }
    // const u = await User.create(form)
    // const all = await User.validLogin(form)
    const remove = await User.deleteOne(query).exec()
    console.log(remove)
}

// test()
module.exports = User

