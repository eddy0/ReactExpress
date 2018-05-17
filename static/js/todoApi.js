/*
let api = new Ajax()
api.all().then()

get(path)
post({
path: path,
data: data})
all()
add(data)
update(id, data)
remove(id)

*/

class Ajax {
    constructor() {
        // this.baseUrl = 'http://111.230.7.89'
        this.baseUrl = 'http://localhost:7000'
    }

    ajaxImg({ path, data}) {
        let method = 'POST'
        let url = this.baseUrl + path

        let promise = new Promise((resolve, reject) => {
            const r = new XMLHttpRequest()
            r.open(method, url, true)
            r.onreadystatechange = () => {
                if(r.readyState === 4) {
                    let res = JSON.parse(r.response)
                    resolve(res)
                }
            }
            r.onerror = () => {
                reject(r)
            }

            r.send(data)
        })
        return promise
    }

    ajaxpro({method, path, headers, data}) {
        method = method || 'GET'
        path = path || '/'
        headers = headers || 'application/json'
        data = data || {}
        let url = this.baseUrl + path
        let promise = new Promise((resolve, reject) => {
            const r = new XMLHttpRequest()
            r.open(method, url, true)
            r.setRequestHeader('Content-Type', headers)
            r.onreadystatechange = () => {
                if(r.readyState === 4) {
                    let res = JSON.parse(r.response)
                    resolve(res)
                }
            }
            r.onerror = () => {
                reject(r)
            }

            data = JSON.stringify(data)
            r.send(data)
        })
        return promise
    }

    get(path, headers) {
        let method = 'GET'
        return this.ajaxpro({
            method: method,
            path: path,
            headers: headers,
        })
    }

    post({path, data, headers}) {
        let method = 'POST'
        return this.ajaxpro({
            method: method,
            path: path,
            data: data,
            headers: headers,
        })
    }
}

class TodoApi extends Ajax {
    constructor() {
        super()
        this.baseUrl = super.baseUrl + '/api'
    }
    all() {
        let path = '/all'
        return this.get(path)
    }

    add(data) {
        let path = '/add'
        return this.post({
            path: path,
            data: data
        })
    }

    update(id, data) {
        let path = '/update/' + String(id)
        return this.post({
            path: path,
            data: data})
    }

    remove(id) {
        let path = '/delete/' + String(id)
        return this.get(path)
    }
}

class LoginApi extends Ajax {
    constructor() {
        super()
        this.baseUrl = this.baseUrl + '/api'
    }

    siginIn(data) {
        let path = '/signin'
        return this.post({
            path: path,
            data: data,
        })
    }

    signUp(data) {
        let path = '/signup/valid'
        return this.post({
            path: path,
            data: data,
        })
    }
}

class TopicApi extends Ajax {
    constructor() {
        super()
        this.baseUrl = this.baseUrl + '/api/topic'
    }

    all() {
        let path = '/all'
        return this.get(path)
    }

    add(data) {
        let path = '/new'
        return this.post({
            path: path,
            data: data
        })
    }

    full(id) {
        let path = '/full/' + String(id)
        return this.get(path)
    }

    brief(id) {
        let path = '/brief/' + String(id)
        return this.get(path)
    }

    star(id, status) {
        let path = '/star'
        let data = {
            starred: status,
            id: id,
        }
        return this.post({
            path: path,
            data: data,
        })
    }

    mark(id, status) {
        let path = '/mark'
        let data = {
            marked: status,
            id: id,
        }
        return this.post({
            path: path,
            data: data,
        })
    }
}

class SettingApi extends Ajax {
    constructor() {
        super()
        this.baseUrl = this.baseUrl + '/api/user'
    }

    uploadImg(data) {
        let path = '/upload/avatar'
        return this.ajaxImg({path, data})
    }

    update(data) {
        let path = '/setting'
        return  this.post({
            path: path,
            data: data,
        })
    }
}

class CommentApi extends Ajax {
    constructor() {
        super()
        this.baseUrl = this.baseUrl + '/api/comment'
    }

    add(data) {
        let path = '/add'
        return this.post({
            path: path,
            data: data
        })
    }

    reply(data) {
        let path = '/reply'
        return this.post({
            path: path,
            data: data,
        })
    }

}

class UserAjax extends Ajax {
    constructor() {
        super()
        this.baseUrl = this.baseUrl + '/api'
    }

    fetch(path) {
        return this.get(path)
    }
}

class ChatAjax extends Ajax {
    constructor() {
        super()
        this.baseUrl = this.baseUrl + '/chat/api'
    }

    add(data) {
        let path = '/add'
        return this.post({
            path: path,
            data: data
        })
    }
}

