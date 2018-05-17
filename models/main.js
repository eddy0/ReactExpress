const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/react_express'
mongoose.Promise = global.Promise
mongoose.connect(url)

class Model extends mongoose.Model{
    static async all(){
        return super.find()
    }

    static async get(id){
        return super.findById(id).catch(() => null)

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
        let m = await super.create(form)
        Object.keys(args).forEach( k => m[k] = args[k] )
        m.save()
        return m
    }

    static async remove(id){
        let query = {
            _id: id,
        }
        return super.deleteOne(query).exec()
    }
}

module.exports = {
    mongoose: mongoose,
    Model: Model,
}