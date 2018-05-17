const {mongoose, Model} = require('./main')
const Schema = mongoose.Schema
const { log } = require('../utils')

const CommentSchema = new Schema({
    uid: String,
    replyToId: {
        type: String,
    },
    topicId: {
        type: String,
    },
    content: {
        type: String,
    },
    stars: {
        type: Array,
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


class CommentStore extends Model {
    async isAuthor() {
        const Topic = require('./topic.js')
        let topic = await Topic.get(this.topicId)
        if (topic !== null) {
            let authorId = topic.uid
            return JSON.stringify(authorId) === JSON.stringify(this.uid)
        }
    }

    async replyTo() {
        const User = require('./user.js')
        if (this.replyToId === undefined) {
            return null
        } else {
            let cls = this.constructor
            const author = await cls.get(this.replyToId)
            let uid = author.uid
            let u = await User.get(uid)
            return u
        }
    }

    async user(uid) {
        const User = require('./user.js')
        const u = await User.get(uid)
        return u
    }

    static async commentByTopic(topicId) {
        const User = require('./user.js')
        let comments = await this.findAll('topicId', topicId)
        comments = await Promise.all( comments.map( async(comment) => {
            let user = await User.get(comment.uid)
            let isAuthor = await comment.isAuthor()
            let replyToAuthor = await comment.replyTo()
            return {...comment._doc, user, isAuthor, replyToAuthor}
        }))
        return comments
    }

    static async comment(topicId) {
        const Topic = require('./topic.js')
        let t = await Topic.get(topicId)
            t.comments += 1
            t.save()
    }

    static async _formattedComment(form) {
        let comment = await Comment.create(form)
        Comment.comment(form.topicId)
        let isAuthor = await comment.isAuthor()
        let replyToAuthor = await comment.replyTo()
        comment = { ...comment._doc, isAuthor, replyToAuthor}
        return comment
    }





}

CommentSchema.loadClass(CommentStore)
const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment

