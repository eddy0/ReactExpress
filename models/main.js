const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/react'
mongoose.Promise = global.Promise
mongoose.connect(url)

class Model extends mongoose.Model{
    static async all(){
        return super.find()
    }

    static async get(id){
        return super.findById(id)
    }

    static async findBy(key, value){
        const query = {
            [key]: value
        }
        return super.findOne(query).exec()
    }

    static async findAll(key, value){
        const query = {
            [key]: value
        }
        return super.find(query).exec()
    }

    static async create(form, args={}){
        const kwargs = Object.assign({__deleted: false}, args)
        let m = await super.create(form)
        Object.keys(args).forEach( k => m[k] = args[k] )
        m.save()
        return m
    }

    static async remove(id){
        let query = await this.get(id)
        let form = {
            __deleted: true
        }
        if (query !== null) {
            return super.update(query, form).exec()
        } else {
            return null
        }
    }
}

module.exports = {
    mongoose: mongoose,
    Model: Model,
}