class Scene{
    constructor(game) {
        this.game = game
        this.items = []
    }

    static create(game) {
        return this.new(game)
    }

    update() {

    }

    draw() {
        // for (let i = 0; i < this.items.length; i++ ) {
        //     let element = this.items[i]
        //     this.game.drawImg(element)
        // }
    }

}

class SceneVrKy extends Scene{
    constructor(game){
        super(game)
        this.paddle = new Paddle(this.game)
        this.ball = new Ball(this.game)
        this.score = 0
        this.blocks = []
        let level = [
            [ 41, 40 ],
            [ 112, 40 ],
            [ 195, 41 ],
            [ 296, 44 ],
            [ 261, 93 ],
            [ 197, 112 ],
            [ 81, 115 ],
            [ 369, 145 ],
            [ 60, 77 ],
            [ 285, 17 ],
            [ 179, 12 ],
            [ 31, 129 ],
            [ 151, 81 ],
            [ 91, 12 ]
        ]
        for (let i = 0; i < level.length; i++ ) {
            let item = level[i]
            let b = new Block(this.game)
            b.x = item[0]
            b.y = item[1]
            this.blocks.push(b)
        }
        this.bindActions()
    }

    bindActions() {
        this.game.on('a', () => {
            this.paddle.moveLeft()
        })

        this.game.on('d', () => {
            this.paddle.moveRight()
        })

        this.game.on('f', () => {
            this.ball.fire()
        })

    }

    draw() {
        let g = this.game
        g.context.fillStyle = '#f6f6f6'
        g.context.fillRect(0,0,g.canvas.width,g.canvas.height)

        g.context.fillStyle = '#000'
        g.context.font = '16px san-serif'
        g.context.fillText('score: 0', 55, 290)

        g.context.drawImage(this.paddle.image, this.paddle.x, this.paddle.y )
        g.context.drawImage(this.ball.image, this.ball.x, this.ball.y )
        for (let i = 0; i < this.blocks.length; i++ ) {
            let block = this.blocks[i]
            if (block.alive) {
                g.context.drawImage(block.image, block.x, block.y )
            }
        }
    }

    update() {
        if (window.enablePause) {
            return
        }

        if (this.ball.y  > this.paddle.y + this.paddle.image.height) {
            let s = new SceneEnd(this.game)
            this.game.replaceScene(s)
            return
        }

        if (this.ball.fired) {
            this.ball.move()
        }
        if (this.paddle.collide(this.ball)) {
            this.ball.redirect()
        }

        for (let i = 0; i < this.blocks.length; i++ ) {
            let block = this.blocks[i]
            if (block.collide(this.ball)) {
                block.kill()
                this.ball.redirect()
                if (block.alive) {
                    this.ball.redirect()
                } else {
                    this.blocks.splice(i, 1)
                    this.score += 100
                    this.game.context.fillText(`score: ${this.score}` , 55, 290)
                }
            }
        }

        if (this.blocks.length < 1 ) {
            let s = new SceneWin(this.game)
                this.game.replaceScene(s)
                return
        }

        this.debug()


    }

    debug() {
        let dragable
        window.addEventListener('mousedown', (event) => {
            if (window.enableDrag) {
                dragable = true
            }
        })

        window.addEventListener('mousemove', (event) => {
            // log(event)
            if (dragable) {
                this.ball.x = event.offsetX
                this.ball.y = event.offsetY
            }
        })

        window.addEventListener('mouseup', (event) => {
            dragable = false
        })
    }


}

class SceneMain extends Scene {
    constructor() {
        super()
        this.init()
        this.setUp()
    }

    init() {
        this.game.scene = this
        this.ball = Ball.create('ball')
        this.paddle = Paddle.create('paddle')
        this.brick = Brick.create('block')
        this.items = [this.ball, this.paddle, this.brick]

    }

    mapper() {
        let m = {
            'a': () => this.paddle.moveLeft(),
            'd': () => this.paddle.moveRight(),
            'f': () => this.ball.fire(),
            'p': () => this.ball.pause(),
        }
        return m
    }

    setUp() {
        let mapper = this.mapper()
        for (let key in mapper  ) {
            this.game.on(key, mapper[key])
        }
    }

    update() {
        super.update()
        this.ball.move()
        let paddleCollide = this.paddle.collide(this.ball)
        if (paddleCollide) {
            this.ball.redirect()
        }
        let brickCollide = this.brick.collide(this.ball)
        if (brickCollide) {
            this.ball.kill()
        }
        for (let i = 0; i < this.items.length; i++) {
            let element = this.items[i]
            if (element.alive) {
                this.game.drawImg(element)
            }
        }
    }


}


