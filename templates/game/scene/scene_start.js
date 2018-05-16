
class SceneStart extends Scene{
    constructor(game){
        super(game)
        this.init()
    }

    init() {
        this.game.on('k', () => {
            let s = new SceneVrKy(this.game)
            this.game.replaceScene(s)
        })
    }

    draw() {
        let context = this.game.context
        context.fillStyle = '#000'
        context.font = '30px san-serif'
        context.textAlign = 'center'
        context.fillText('press k to start', 200, 150)
    }

    update() {


    }



}