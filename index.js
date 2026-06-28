const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

document.title = "Mini Gardening Pets Edition";

document.body.style.margin = '0'
document.body.style.overflow = 'hidden'

canvas.width = 1024
canvas.height = 576
canvas.style.width = '100vw'
canvas.style.height = '100vh'
canvas.style.display = 'block'

const backgroundMusic = new Audio('./mini it/music/mini it music.mp3')
backgroundMusic.loop = true
backgroundMusic.volume = 0.10
backgroundMusic.play()

const plantingSound = new Audio('./mini it/music/plant sound.wav')
plantingSound.volume = 0.35

function playBackgroundMusic() {
    const playPromise = backgroundMusic.play()

    if (playPromise) {
        playPromise.catch(() => {
            window.addEventListener('keydown', playBackgroundMusic, { once: true })
            window.addEventListener('click', playBackgroundMusic, { once: true })
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

const seedImage = new Image()
seedImage.src = './mini it/image/corps/seed.png'

const plantStage1Image = new Image()
plantStage1Image.src = './mini it/image/corps/plant stage 1.png'

const plantStage2Image = new Image()
plantStage2Image.src = './mini it/image/corps/plant stage 2.png'

const plantStage3Image = new Image()
plantStage3Image.src = './mini it/image/corps/plant stage 3.png'

const plantStages = [plantStage1Image, plantStage2Image, plantStage3Image]
const cropImages = [
    './mini it/image/corps/c.red.png',
    './mini it/image/corps/c.yellow.png',
    './mini it/image/corps/c.green.png',
    './mini it/image/corps/c.orange.png',
    './mini it/image/corps/c.purple.png'
].map((src) => {
    const image = new Image()
    image.src = src
    return image
})
const cropNames = ['Carrot', 'Corn', 'Lettuce', 'Wheat', 'Grass']
const plantGrowthTime = 2000
const cropGrowthTime = 3000


const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {       // The map data is one long list, so this cuts it into rows of 70 tiles.
    collisionsMap.push(collisions.slice(i, 70 + i))
}

const farmMap = []
for (let i = 0; i < farm.length; i += 70) {     // This makes farm[row][column] possible when checking planting tiles.
    farmMap.push(farm.slice(i, 70 + i))
}

const restaurantMap = []
for (let i = 0; i < sales.length; i += 70) {
    restaurantMap.push(sales.slice(i, 70 + i))
}

const cookingMap = []
for (let i = 0; i < cooking.length; i += 70) {
    cookingMap.push(cooking.slice(i, 70 + i))
}

const shopMap = []
for (let i = 0; i < shop.length; i += 70) {
    shopMap.push(shop.slice(i, 70 + i))
}

class Boundary {
    static width = 48
    static height = 48

    constructor({ position }) {
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
    constructor({ position, image, frames = { max: 1, hold: 10 }, sprites }) {
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

        this.frames.elapsed++   // Slow walking animation so frame does not change every refresh.
        if (this.frames.elapsed % this.frames.hold === 0) {
            if (this.frames.val < this.frames.max - 1) {
                this.frames.val++
            } else {
                this.frames.val = 0
            }
        }
    }
}

class TileSprite {
    constructor({ position, image, tileKey }) {
        this.position = position
        this.image = image
        this.tileKey = tileKey
        this.width = Boundary.width
        this.height = Boundary.height
    }

    draw() {
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    grow() {
        plantStages.forEach((stageImage, index) => {
            setTimeout(() => {
                this.image = stageImage
            }, plantGrowthTime * (index + 1))
        })

        setTimeout(() => {
            const randomCropIndex = Math.floor(Math.random() * cropImages.length)
            this.image = cropImages[randomCropIndex]
        }, plantGrowthTime * plantStages.length + cropGrowthTime)
    }
}

const boundaries = []
const plantedSeeds = []
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
const renderables = [background, ...boundaries, ...plantedSeeds, player, foreground]

const horizontalSpeed = 5
const verticalSpeed = 4.4
let changingPage = false
// Key name used to save the farm position before going to another page.
const farmReturnPositionKey = 'farmReturnPosition'

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function move({ x, y }) {
    let moving = true
    // Save the map position before moving, so we can return here later.
    const previousPosition = {
        x: background.position.x,
        y: background.position.y
    }

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

        // Check if the player stepped on a page-changing tile.
        checkPageChange(previousPosition)
    }
}

// Use the player's leg so planting where the character is standing.
function getPlayerFarmTile() {
    const playerCenterX = player.position.x + player.width / 2
    const playerFeetY = player.position.y + player.height - 1

    // Change the game array to farm array
    const column = Math.floor((playerCenterX - background.position.x) / Boundary.width)
    const row = Math.floor((playerFeetY - background.position.y) / Boundary.height)

    return {
        row,
        column,
        tileKey: `${row}-${column}`
    }
}

function saveFarmReturnPosition(position) {
    // sessionStorage keeps this value when moving between pages in the same tab.
    sessionStorage.setItem(farmReturnPositionKey, JSON.stringify(position))
}

function restoreFarmReturnPosition() {
    // If the player did not come back from another page, there is nothing to restore.
    const savedPosition = sessionStorage.getItem(farmReturnPositionKey)
    if (!savedPosition) return

    // Remove it after using it so a normal page refresh starts from the default place.
    sessionStorage.removeItem(farmReturnPositionKey)

    try {
        const position = JSON.parse(savedPosition)

        // Only restore if the saved data is valid.
        if (typeof position.x !== 'number' || typeof position.y !== 'number') return

        // Move the whole map back to the saved position.
        const xChange = position.x - background.position.x
        const yChange = position.y - background.position.y

        movables.forEach((movable) => {
            movable.position.x += xChange
            movable.position.y += yChange
        })
    } catch (error) {
        console.warn('Could not restore farm position:', error)
    }
}

function goToPage(page, returnPosition) {
    // Save the farm position first, then open the selected page.
    changingPage = true
    saveFarmReturnPosition(returnPosition)
    goToGamePage(page)
}

function checkPageChange(returnPosition = background.position) {
    if (changingPage) return

    const { row, column } = getPlayerFarmTile()

    // Restaurant entrance.
    if (restaurantMap[row] && restaurantMap[row][column] === 3484) {
        goToPage('customersalesfinal2.0.html', returnPosition)
    // Cooking entrance.
    } else if (cookingMap[row] && (cookingMap[row][column] === 1439 || cookingMap[row][column] === 1462)) {
        goToPage('cooking.html', returnPosition)
    // Shop entrance.
    } else if (shopMap[row] && shopMap[row][column] === 2393) {
        goToPage('shop.html', returnPosition)
    }
}

function plantSeed() {
    const { row, column, tileKey } = getPlayerFarmTile()

    // Only tile number 1206 can plant seed.
    if (!farmMap[row] || farmMap[row][column] !== 1206) return

    // Stop the same tile from getting more than one seed.
    if (plantedSeeds.some((seed) => seed.tileKey === tileKey)) return

    if (!InventoryStore.removeItem('Seed')) {
        alert('You need to buy a Seed first!')
        return
    }

    // Place the seed at top-left corner of that farm tile.
    const seed = new TileSprite({
        position: {
            x: column * Boundary.width + background.position.x,
            y: row * Boundary.height + background.position.y
        },
        image: seedImage,
        tileKey
    })

    plantedSeeds.push(seed)
    movables.push(seed)
    renderables.splice(renderables.indexOf(player), 0, seed)  // Draw the seed before the player so will not bug
    plantingSound.currentTime = 0
    plantingSound.play()
    seed.grow()
}

function removeItem(array, item) {
    const index = array.indexOf(item)

    if (index !== -1) {
        array.splice(index, 1)
    }
}

function harvestPlant() {
    const { tileKey } = getPlayerFarmTile()
    const plant = plantedSeeds.find((seed) => seed.tileKey === tileKey)

    if (!plant) return
    if (!cropImages.includes(plant.image)) return

    InventoryStore.addItem(cropNames[cropImages.indexOf(plant.image)])
    removeItem(plantedSeeds, plant)
    removeItem(movables, plant)
    removeItem(renderables, plant)
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
        move({ x: 0, y: verticalSpeed })
    } else if (keys.a.pressed && lastKey === 'a') {
        player.animate = true
        player.image = player.sprites.left
        move({ x: horizontalSpeed, y: 0 })
    } else if (keys.s.pressed && lastKey === 's') {
        player.animate = true
        player.image = player.sprites.down
        move({ x: 0, y: -verticalSpeed })
    } else if (keys.d.pressed && lastKey === 'd') {
        player.animate = true
        player.image = player.sprites.right
        move({ x: -horizontalSpeed, y: 0 })
    }
}

let lastKey = ''
// Restore the saved map position before the first frame draws.
restoreFarmReturnPosition()
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
        case 'f':
            plantSeed()
            break
        case 'r':
            harvestPlant()
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
