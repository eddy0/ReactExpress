class SceneEnd extends Scene{
    constructor(game) {
        super(game)
        this.init()

    }

    init() {
        this.game.on('r', () => {
            let s = new SceneStart(this.game)
            this.game.replaceScene(s)
        })
    }


    draw() {
        this.game.context.font='23px Arial'
        this.game.context.fillText('game over, press r to restart', 200, 150)
    }

}

class SceneWin extends Scene{
    constructor(game) {
        super(game)
        this.init()
    }

    init() {
        this.game.on('r', () => {
            let s = new SceneVrKy(this.game)
            this.game.replaceScene(s)
        })
    }


    draw() {
        this.game.context.fillText('YOU WIN!!! press r to restart', 150, 150)
    }

}


const updateDiv = (blocks) => {
    let result = []
    for (let i = 0; i < blocks.length; i++ ) {
        let b = blocks[i]
        let level = [b.x, b.y]
        result.push(level)
    }
    const div = e('#id-edit-result')
    let r = JSON.stringify(result, null, 2)
    div.innerHTML = r
}

class SceneEdit extends Scene{
    constructor(game) {
        super(game)
        this.blocks = []
        this.bindActions()
    }

    bindActions() {
        this.game.canvas.addEventListener('click', (event) => {
            let block = new Block(this.game)
            block.x = event.offsetX
            block.y = event.offsetY
            this.blocks.push(block)
            updateDiv(this.blocks)
        })

    }

    update() {
        window.addEventListener('keyup', (event) => {
            if (event.key === 'Escape') {
                this.blocks = []
                updateDiv(this.blocks)
            }
        })
    }


    draw() {
        for (let i = 0; i < this.blocks.length; i++ ) {
            let b = this.blocks[i]
            this.game.drawImg(b)
        }
    }
}