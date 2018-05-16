
const getData = () => {
    const database = [
        {
            title: '走在冷风中',
            author: '周二珂',
            src: '/static/music/1.mp3',
        },
        {
            title: 'ship in the sand',
            author: 'Sophia',
            src: '/static/music/2.mp3',
        },
        {
            title: '夜空中最亮的星',
            author: '逃跑计划',
            src: '/static/music/3.mp3',
        },
        {
            title: 'Chasing Pavements',
            author: 'Adele',
            src: '/static/music/4.mp3',
        },
    ]
    return database
}

const togglePlayBtn = (selector) => {
    let s = selector ||'.btn-music-play'
    let element = e(s)
    let active = 'wd-on'
    removeClassAll(active)
    element.classList.add(active)
}

const indexFromModel = (button, db) => {
    const audio = e('#id-player-audio')
    const model = e('.model-active')
    let index
    if (model.id ==='id-model-shuffle'){
        index = randomIndex(db)
    } else {
        const offset = Number(button.dataset.offset)
        index = nextIndex(db, audio, offset)
    }
    return index
}


const updateMusic = (song, audio) => {
    audio.src = song.src
    let name = e('.song-name')
    let author = e('.song-author')
    name.innerText = song.title
    author.innerText = song.author
}

const switchByButton = (button, audio ) => {
    const db = getData()
    let index = indexFromModel(button, db)
    let song = db[index]
    updateMusic(song, audio)
    playMusic()
    togglePlayBtn()
}

const bindPlay = () => {
    const audio = e('#id-player-audio')

    bind('.btn-music-play', 'click', ()=>{
        let selector = '.btn-music-play'
        togglePlayBtn(selector)
        audio.play()
    })

    bind('.btn-music-pause', 'click', ()=>{
        let selector = '.btn-music-pause'
        togglePlayBtn(selector)
        audio.pause()
    })

    bind('.btn-music-last', 'click', ()=>{
        const button = e('.btn-music-last')
        switchByButton(button, audio)
        highlightSong()
        playMusic()
    })

    bind('.btn-music-next', 'click', ()=>{
        const button = e('.btn-music-next')
        switchByButton(button, audio)
        highlightSong()
        playMusic()
    })
}

const wrapupTime = (t) => {
    t = String(t)
    if (t >= 10){
        return t
    } else {
        return `0${t}`
    }
}

const musicTime = (time) => {
    time = Number(time)
    let minute = Math.floor(time / 60)
    let second = Math.floor(time % 60)
    minute = wrapupTime(minute)
    second = wrapupTime(second)
    let t = `${minute}:${second}`
    return t
}

const bindDurationTime = (audio) => {
    bind('#id-player-audio', 'canplay', ()=> {
        const durationBox = e('#id-music-duration')
        const total = audio.duration
        const t = musicTime(total)
        durationBox.innerHTML = t
    })
}

const updateCurrentTime = (currentTime) => {
    const currentBox = e('#id-music-current')
    let t = musicTime(currentTime)
    currentBox.innerHTML = t
}

const bindCurrentTime = (audio) => {
    let f = () => {
        let interval = 1000
        let t = setInterval( () =>{
            let current = audio.currentTime
            updateCurrentTime(current)
        }, interval)
        return t
    }
    return f
}

const updateProgressBar = (audio) => {
    let played = e('.line-played')
    let preload = e('.line-preload')
    if (audio.readyState === 0) {
        preload.style.width = `0px`
        played.style.width = `0px`
    }  else {
        let current = Math.round(audio.currentTime)
        let duration = audio.duration
        let buffer = audio.buffered
        if (buffer.length > 0) {
            let buffered = buffer.end(0)
            let now = Math.round(200 * current / duration)
            let loaded = Math.round(200 * buffered / duration)
            preload.style.width =  `${loaded}px`
            played.style.width = `${now}px`
        }

    }
}


const moveByTime = (audio) => {
    let interval = 1000
    let t = setInterval( () =>{
        updateProgressBar(audio)
    }, interval)
    return t
}



const bindTimeBar = (audio) => {
    let tick = moveByTime(audio)

    // manual set current time by input bar &&
    // will effect on current time box

    let wrapper = e('.timeline')

    wrapper.addEventListener('click', (event)=> {
        let time = event.offsetX
        log(event.offsetX)
        clearInterval(bindCurrentTime(audio))
        audio.currentTime = time
        updateCurrentTime(time)
        updateProgressBar(audio)
        playMusic()
        togglePlayBtn()

    })

    // disable interval when mouse down on input

    // let pointer = e('.progress-bar-pointer')
    // pointer.addEventListener('mousedown', (event)=> {
    //     // clearInterval(bindCurrentTime(audio))
    //     let played = e('.line-played')
    //     played.style.width = event.offsetX
    //     log(event.offsetX)
    //
    //     clearInterval(tick)
    // })
    //
    // // enable interval when mouse down on input
    //
    // pointer.addEventListener('mouseup', ()=> {
    //     tick = moveByTime(audio)
    //     togglePlayBtn()
    // })

}

const bindTime = () => {
    const audio = e('#id-player-audio')
    bindDurationTime(audio)
    bindCurrentTime(audio)()
    bindTimeBar(audio)
}

const playMusic = () => {
    const audio = e('#id-player-audio')
    audio.addEventListener('canplay', () => {
        audio.play()
    })
}

const highlightSong = () => {
    const audio = e('#id-player-audio')
    const current = decodeURI(audio.src)
    const src = current.split('/').pop()
    const list = es('.music-song')
    for (let i = 0; i < list.length; i++) {
        let s = list[i]
        let path = s.dataset.path.split('/').pop()
        if (src === path) {
            removeClassAll('song-active')
            s.classList.add('song-active')
        }
    }
}

const updateSong = (index, audio) => {
    const db = getData()
    let song = db[index]
    updateMusic(song, audio)
}

const bindPlayList = () => {
    highlightSong()
    const audio = e('#id-player-audio')
    bind('.music-playlist', 'click', (event) => {
        let self = event.target
        if (self.classList.contains('music-song')){
            togglePlayBtn()
            let index = Number(self.dataset.index)
            updateSong(index, audio)
            highlightSong()
            playMusic()
        }
    })
}

const nextIndex = (db, audio, offset) => {
    const len = db.length
    const current = audio.src
    const path = current.split('/').pop()
    let index = db.findIndex( song => {
        let src = song.src.split('/').pop()
        return src === path
    })
    if (index > -1){
        let i = (len + index + offset) % len
        return i
    }
}

const playNormal = () => {
    const audio = e('#id-player-audio')
    const db = getData()
    let index = nextIndex(db, audio, 1)
    let song = db[index]
    updateMusic(song, audio)
    highlightSong()
    playMusic()
}

const playRepeat = () => {
    const audio = e('#id-player-audio')
    audio.currentTime = 0
    playMusic()
}

const random = (start, end) => {
    let max = Math.random() * (end - start + 1)
    let i = Math.floor(max + start)
    return i
}

const randomIndex = (db) => {
    const len = db.length - 1
    const index = random(0, len)
    return index
}

const playRandom = () => {
    const audio = e('#id-player-audio')
    const db = getData()
    let index = randomIndex(db, audio)
    let song = db[index]
    updateMusic(song, audio)
    highlightSong()
    playMusic()
}

const activeModel = (audio, id) => {
    const models = {
        'id-model-repeat':  playRepeat,
        'id-model-normal': playNormal,
        'id-model-shuffle': playRandom,
    }
    if (id !== undefined){
        let mod = models[id]
        audio.removeEventListener('ended', mod)
    }
    const active = e('.model-active')
    let model = active.id
    let playMod = models[model]
    audio.addEventListener('ended', playMod)
}

const modelByClick = (id) => {
    const models = [
        'id-model-normal',
        'id-model-repeat',
        'id-model-shuffle',
    ]
    let len = models.length
    let index = models.findIndex( i => i === id)
    if (index > -1){
        let i = (len + index + 1) % len
        let m = models[i]
        let model = e(`#${m}`)
        return model
    }
}

const bindPlayModel = () => {
    // initial model when web start
    const audio = e('#id-player-audio')
    activeModel(audio)

    bindAll('player-model', 'click', (event) => {
        let self = event.target
        let id = self.id
        let model = modelByClick(id)
        removeClassAll('model-active')
        model.classList.add('model-active')
        activeModel(audio, id)
    })
}

const initMusicList = async () => {
    const wrapper = e('.list-items')
    let db = await getData()
    let data = db.map( (d, i) => {
        let t = (`
            <li class="music-song" data-index="${i}"  data-author="'${d.author}" data-path="${d.src}">${d.title}</li>
        `)
        return t
    })
    wrapper.dataset.songs = data.length
    data = data.join('\r\n')
    appendHtml(wrapper, data)
}

const __musicMain = () => {
    initMusicList()
    bindPlay()
    bindTime()
    bindPlayList()
    bindPlayModel()
}

__musicMain()
