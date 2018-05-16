const Model = require('./main.js')
const crypto = require('crypto')
const { log } = require('../utils.js')

class Bookmark extends Model {
    constructor(form={}) {
        super(form)
        this.uid = form.uid || -1
        this.topicId = form.topicId || -1
    }

    toggle(form) {


    }


}

module.exports = User

