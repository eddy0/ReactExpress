const {mongoose, Model} = require('./main')
const Schema = mongoose.Schema
const { log, random } = require('../utils')

const TagSchema = new Schema({
    name: {
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
const Tag = mongoose.model('Tag', TagSchema)


// const test = () => {
//     let form = {
//         name: 'back-end'
//     }
//     Tag.create(form)
// }
//
// test()

module.exports = Tag

