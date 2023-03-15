import Car from './car.js'
import Road from './road.js'

const canvas = document.querySelector('canvas')
canvas.width = 200

const ctx = canvas.getContext('2d')
const road = new Road(canvas.width / 2, canvas.width * 0.9, 3)
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS")
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)
]

animate()

function animate() {
    for (const car of traffic) {
        car.update(road.borders, [])
    }
    car.update(road.borders, traffic)
    // responsive canvas and clears the canvas
    canvas.height = window.innerHeight

    ctx.save()
    ctx.translate(0, -car.y + canvas.height * 0.7)

    road.draw(ctx)
    for (const c of traffic) {
        c.draw(ctx, "red")
    }
    car.draw(ctx, "blue")

    ctx.restore()

    requestAnimationFrame(() => animate())
}
