const e = sel => document.querySelector(sel)

const log = console.log.bind(console)




let path = {
    paddle: 'src/paddle.png',
    ball: 'src/ball.png',
    block: 'src/block.png',
}

const rectIntersect = function(a, b) {
    if (b.y > a.y && b.y < a.y + a.image.height) {
        if (b.x > a.x && b.x < a.x + a.image.width) {
            return true
        }
    }
    return false
}

window.enablePause = false
window.enableDrag = false
const debugMod = () => {
    window.addEventListener('keyup', (event) => {
        if (event.key === 'p') {
            window.enablePause = !window.enablePause
        }
    })
}

const enableDebug = () => {
    let button = e('#id-button-debug')
    button.addEventListener('click', () => {
        window.enableDrag = !window.enableDrag
        debugMod()
    })
}

enableDebug()