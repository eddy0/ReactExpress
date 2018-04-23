/*
all()
add(data)
update(id, data)
remove(id)

let api = new TodoApi()
api.all().then()

*/


class TodoApi{
    constructor() {
        this.baseUrl = 'https://localhost:8000/api'
    }
    
    ajaxpro({method, path, headers, data}) {
        method = method || 'GET'
        path = path || '/'
        headers = headers || 'application/json'
        data = data || {}
        let url = this.baseUrl + path
        let promise = new Promise ( (resolve, reject) => {
            const r = new XMLHttpRequest()
            r.open(method, url, true)
            r.setRequestHeader('Content-Type', headers)
            r.onreadystatechange = () => {
                if (r.readyState === 4){
                    resolve(r.response)
                }
            }
            r.onerror =() => {
                reject(r)
            }

            data = JSON.stringify(data)
            r.send(data)
        })
        return promise
    }

    get(path) {
        let method = 'GET'
        return this.ajaxpro({
            method: method,
            path: path
        })
    }

    post(path, data) {
        let method = 'POST'

        if (path === '/login'){

        let user = {
            avatar: 'http://www.material-ui.com/images/ok-128.jpg',
            id: 1,
        }
        let r = {
            message:'',
            success: true,
            data: Object.assign(data, user)
        }

        return r
        }
        // return this.ajaxpro({
        //     method: method,
        //     path: path,
        //     data: data,
        // })
    }

    all() {
        let path = '/all'
        return this.get(path)
    }

    add(data) {
        let path = '/add'
        return this.post(path, data)
    }

    update(id, data) {
        let path = '/update/' + String(id)
        return this.post(path, data)
    }

    remove(id) {
        let path = '/delete/' + String(id)
        return this.get(path)
    }
}
