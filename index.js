const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

document.title = "Mini Gardening Pets Edition";

canvas.width = 1024
canvas.height = 576

const backgroundMusic = new Audio('./mini it/music/mini it music.mp3')
backgroundMusic.loop = true
backgroundMusic.volume = 0.10

function playBackgroundMusic() {
    const playPromise = backgroundMusic.play()

    if (playPromise) {
        playPromise.catch(() => {
            window.addEventListener('keydown', playBackgroundMusic, {once: true})
            window.addEventListener('click', playBackgroundMusic, {once: true})
        })
    }
}

playBackgroundMusic()

const image = new Image()
image.src = './mini it/image/gardening map.png'

const foregroundImage = new Image()
foregroundImage.src = './mini it/image/foregroundObjects.png'

const playerDownImage = new Image()
playerDownImage.src = './mini it/image/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './mini it/image/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './mini it/image/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './mini it/image/playerRight.png'


const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, 70 + i))
}

class Boundary {
    static width = 48
    static height = 48

    constructor({position}) {
        this.position = position
        this.width = 48
        this.height = 48
    }

    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0.0)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Sprite {
    constructor({position, image, frames = {max: 1, hold: 10}, sprites}) {
        this.position = position
        this.image = image
        this.frames = {
            max: frames.max,
            hold: frames.hold || 10,
            val: 0,
            elapsed: 0
        }
        this.sprites = sprites
        this.animate = false
        this.width = 0
        this.height = 0

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
    }

    draw() {
        const cropWidth = this.image.width / this.frames.max

        c.drawImage(
            this.image,
            cropWidth * this.frames.val,
            0,
            cropWidth,
            this.image.height,
            this.position.x,
            this.position.y,
            cropWidth,
            this.image.height
        )

        if (!this.animate || this.frames.max <= 1) return

        this.frames.elapsed++
        if (this.frames.elapsed % this.frames.hold === 0) {
            if (this.frames.val < this.frames.max - 1) {
                this.frames.val++
            } else {
                this.frames.val = 0
            }
        }
    }
}

const boundaries = []
const offset = {
    x: -400,
    y: -515
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        }
    })
})

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const movables = [background, ...boundaries, foreground]
const renderables = [background, ...boundaries, player, foreground]

const horizontalSpeed = 3
const verticalSpeed = 2.4

function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function move({x, y}) {
    let moving = true

    for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]

        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x + x,
                        y: boundary.position.y + y
                    }
                }
            })
        ) {
            moving = false
            break
        }
    }

    if (moving) {
        movables.forEach((movable) => {
            movable.position.x += x
            movable.position.y += y
        })
    }
}

function animate() {
    window.requestAnimationFrame(animate)

    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    renderables.forEach((renderable) => {
        renderable.draw()
    })

    player.animate = false

    if (keys.w.pressed && lastKey === 'w') {
        player.animate = true
        player.image = player.sprites.up
        move({x: 0, y: verticalSpeed})
    } else if (keys.a.pressed && lastKey === 'a') {
        player.animate = true
        player.image = player.sprites.left
        move({x: horizontalSpeed, y: 0})
    } else if (keys.s.pressed && lastKey === 's') {
        player.animate = true
        player.image = player.sprites.down
        move({x: 0, y: -verticalSpeed})
    } else if (keys.d.pressed && lastKey === 'd') {
        player.animate = true
        player.image = player.sprites.right
        move({x: -horizontalSpeed, y: 0})
    }
}

let lastKey = ''
animate()


window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})
