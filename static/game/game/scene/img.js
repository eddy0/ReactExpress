
const imgByName = (name) => {
    let p = path[name]
    let img = new Image()
    img.src = p
    return img
}

const random = (start, end) => {
    let n = Math.random() * (end - start + 1)
    return n + start
}


class Pixel {
    constructor(game) {
        let name = this.constructor.name.toLowerCase()
        this.image = game.ImgByName(name)
        this.canvas = e('#id-canvas-game')
        this.context = this.canvas.getContext('2d')

    }

    static create(name) {
        let instance = new this(name)
        return instance
    }

    collide (ball) {
        return rectIntersect(this, ball) || rectIntersect(ball, this)
    }
}

class Paddle extends Pixel {
    constructor(name) {
        super(name)
        this.x = 150
        this.y = 280
        this.speed = 1
    }

    moveLeft() {
        if (this.x > -3) {
            this.x -= this.speed
        }
    }

    moveRight() {
        if ( this.x + this.image.width < this.canvas.width + 3) {
            this.x += this.speed
        }
    }


}


class Ball extends Pixel {
    constructor(name) {
        super(name)
        this.x = 250
        this.y = 230
        this.speedX = 0.5
        this.speedY = 0.5
        this.fired = false
    }

    fire() {
        this.fired = true
    }

    pause() {
        this.fired = false
    }

    move() {
        if (this.fired) {
            if (this.x < 0 || this.x > this.canvas.width  ) {
                this.speedX = -this.speedX
            }
            if (this.y < 0 || this.y > this.canvas.height  ) {
                this.speedY = -this.speedY
            }
            this.x += this.speedX
            this.y += this.speedY
        }
    }

    redirect() {
        this.speedY = - this.speedY
    }



}

class Block extends Pixel {
    constructor(name) {
        super(name)
        this.x = 50
        this.y = 30
        this.w = 30
        this.h = 10
        this.life = 1
        this.alive = true
    }

    kill() {
        this.life -= 1
        if (this.life === 0) {
            this.alive = false
        }
    }






}
