
class Game {
    constructor(fps, source, callback) {
        window.fps = fps
        this.callback = callback
        this.source = source
        this.images = {}
        this.keys = {}
        this.actions = {}
        this.scene =  null
        this.canvas = e('#id-canvas-game')
        this.context = this.canvas.getContext('2d')
        this.bindEvent()
        this.start()
    }

    static single(...args) {
        const cls = this
        if (cls.instance === undefined) {
            cls.instance = new cls(...args)
        }
        return cls.instance
    }

    bindEvent() {
        window.addEventListener('keydown', (event) => {
            let key = event.key
            if (key in this.keys) {
                this.keys[key] = true
            }
        })

        window.addEventListener('keyup', (event) => {
            let key = event.key
            if (key in this.keys) {
                this.keys[key] = false
            }
        })
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }


    update() {
        this.scene.update()
    }

    drawImg(element) {
        if (element !== undefined) {
            this.context.drawImage(element.image, element.x, element.y )
        }
    }

    draw() {
        // this.drawImg()
        this.scene.draw()
    }

    on(key, action) {
        this.keys[key] = false
        this.actions[key] = action
    }

    ImgByName(name) {
        return this.images[name]
    }

    loadImage(name) {
        let p = new Promise((resolve, reject) => {
            let path = this.source[name]
            let img = new Image
            img.src = path
            img.onload = () => {
                this.images[name] = img
                resolve()
            }
        })
        return p
    }

    start() {
        let names = Object.keys(this.source)
        const list = names.map((name) => {
            const r = this.loadImage(name)
            return r
        })
        Promise.all(list).then( () => {
            this.callback(this)
        })
    }

    runloop() {
        // log(window.fps)

        for (let key in this.keys ) {
            if (this.keys[key] === true) {
                this.actions[key]()
            }
        }
        this.clear()
        this.update()
        this.draw()
        setTimeout( () => {
            this.runloop()
        }, window.fps/1000)
    }

    runWithScene(scene) {
        this.scene = scene
        setTimeout(() => {
            this.runloop()
        }, window.fps/1000)
    }

    replaceScene(scene) {
        this.scene = scene
    }





}
