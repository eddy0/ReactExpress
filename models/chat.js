const Model = require('./main.js')
const { log, random } = require('../utils.js')



class Chat extends Model {
    constructor(form = {}) {
        super(form)
        // 记录 connection 和 disconnection 的信息
        this.socketId = form.socketId || null
        this.uid = form.uid || -1
        this.content = form.content || ''
        this.date = form.date || Date.now()
    }

    static detail(user, id) {
        const m = super.get(id)
        if (m.uid !== user._id) {
            m.views += 1
            m.save()
        }
        return m

    }
}



module.exports = Chat
