const {mongoose, Model} = require('./main')
const Schema = mongoose.Schema
const { log, random } = require('../utils')

const TopicSchema = new Schema({
    uid: String,
    brief: {
        type: String,
    },
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    tag: {
        type: String,
    },
    views: {
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
    __deleted: {
        type: Boolean,
        default: false,
    },

})


class TopicStore extends Model{
    static async create(form) {
        const number = random()
        const { content } = form
        form.brief = content.length > 60?
            `${content.slice(0, number)}...`
            : content
        const t = await super.create(form)
        return t
    }

    static async allList() {
        const User = require('./user')
        const ts = await this.all()
        // link topic with user
        const topics = await Promise.all( ts.map( async t => {
            let users = await User.get(t.uid)
            console.log('users', users)
            if (users !== null) {
                users = users.toObject()
                return Object.assign(users, t.toObject())
            }
        }))
        return topics
    }



    static async detail(id) {
        const t = await this.get(id)
        t.views += 1
        t.save()
        t.content = t.content.replace(/\r\n/g, '<br>')
        return t
    }


    static async update(form) {
        const frozenKeys = [
            id,
            createdTime,
        ]
        return  u = await super.create(form)
    }

    async user() {
        const User = require('./user')
        const u = await User.get(this.uid)
        return u
    }





    // async tag() {
    //     const Tag = require('./tag')
    //     const u = await User.get(this.uid)
    //     return u
    // }

}

TopicSchema.loadClass(TopicStore)
const Topic = mongoose.model('Topic', TopicSchema)

const test = async () => {
    const form = {
        uid: '5ab99fb5483bdbd9e2fa52a0',
        title: 'this is a testteesd3ojb',
        content: 'tasdfadfasfasfhis is a test 1234只要保证符合 ECMAScript 规范规定的语义，内存里是几份是无所谓的。而且就算是两份，通常你也看不出来只要保证符合 ECMAScript 规范规定的语义，内存里是无所，内存里是无所，内存里是无所谓的。而且就算是两份，通常你也看不出... 只要保证符合 ECMAScript 规范规定的语义，内存里是几份是 ',
        tag: 'front-end'
    }
    const query = {
        uid: '5ab99fb5483bdbd9e2fa52a0',
    }
    // const t = await Topic.create(form)
    // console.log(t)
    // const all = await Topic.all()
    // console.log(all)
    // const remove = await Topic.deleteOne(query).exec()
    // console.log(remove)
}

// test()

module.exports = Topic

