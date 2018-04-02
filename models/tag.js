const {mongoose, Model} = require('./main')
const Schema = mongoose.Schema
const { log, random } = require('../utils')

const TagSchema = new Schema({
    tagName: {
        type: String,
        unique: true,
    },
})


class TagStore extends Model{


    static async update(form) {
        return  u = await super.create(form)
    }

}

TagSchema.loadClass(TagStore)
const Tag = mongoose.model('tag', TagSchema)

const test = async () => {
    const form = {
        tagName: 'front-end',
    }
    const query = {
        uid: '5ab99fb5483bdbd9e2fa52a0',
    }
    // const t = await Tag.create(form)
    // console.log(t)
    // const all = await Topic.all()
    // console.log(all)
    // const remove = await Topic.deleteOne(query).exec()
    // console.log(remove)
}

// test()

module.exports = Tag

