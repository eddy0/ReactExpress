const {mongoose, Model} = require('./main')
const Schema = mongoose.Schema
const { log, random } = require('../utils')

const TopicSchema = new Schema({
    uid: String,
    title: {
        type: String,
    },
    brief: {
        type: String,
    },
    content: {
        type: String,
    },
    tags: {
        type: Array,
        default: [],
    },
    marks: {
        type: Array,
        default: [],
    },
    stars: {
        type: Array,
        default: [],
    },
    views: {
        type: Number,
        default: 0,
    },
    comments: {
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
})


class TopicStore extends Model{
    static async create(form) {
        const len = random()
        let { brief } = form
        form.brief = brief.split('\n').join(' ')
        const m = await super.create(form)
        return m
    }

    static async update(form) {
        const id = from.id
        const t = await this.get(id)
        const frozenKeys = [
            id,
            createdTime,
        ]
        Object.keys(form).forEach((k) => {
            if (!frozenKeys.includes(k)) {
                t[k] = form[k]
            }
        })
        t.updatedTime = Date.now()
        t.save()
    }

    async user() {
        const User = require('./user')
        const u = await User.get(this.uid)
        return u
    }

    static async _formattedTopic(u, topic) {
        const User = require('./user')
        let author = await User.get(topic.uid)
        topic = {...topic._doc}
        topic.author = author
        topic.star_status = ''
        topic.mark_status = ''
        if (topic.marks.includes(u._id.toString())) {
            topic.mark_status = 'marked'
        }
        if (topic.stars.includes(u._id.toString())) {
            topic.star_status = 'starred'
        }
        return topic
    }

    static async detail(u, id) {
        let t = await this.get(id).catch(() => null)
        if (t !== null) {
            if (t.uid !== u._id.toString() ) {
                t.views += 1
                t.save()
            }
            t = await this._formattedTopic(u,t)
        }
        return t
    }

    static async topicByUser(u, topics) {
        topics = topics ||  await this.all()
        topics = await Promise.all( topics.map( async (topic) => {
            return this._formattedTopic(u,topic )
        }))
        return topics
    }

    action(u, action) {
        let item = this[action]
        let index = item.findIndex( (id) => {
            // mongoose _id is object
            return JSON.stringify(id) === JSON.stringify( u._id)
        })
        if (index > -1) {
            this[action].splice(index, 1)
        } else {
            this[action].push(u._id.toString())
        }
        this.save()
        return this
    }



    // async tag() {
    //     const Tag = require('./tag')
    //     const u = await User.get(this.uid)
    //     return u
    // }

}

TopicSchema.loadClass(TopicStore)
const Topic = mongoose.model('Topic', TopicSchema)

module.exports = Topic

