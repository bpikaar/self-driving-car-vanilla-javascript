import Controls from './controls.js'
import Sensor from './sensor.js'

export default class Car {

    #speed = 0
    #acceleration = 0.2
    #maxSpeed = 3
    #friction = 0.05
    angle = 0
    #TURN_SPEED = 0.02

    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.sensor = new Sensor(this)
        this.controls = new Controls()
    }

    update(borders) {
        this.#move()
        this.sensor.update(borders)
    }

    #move() {
        // accelerate
        if (this.controls.forward) {
            this.#speed += this.#acceleration
        }
        if (this.controls.reverse) {
            this.#speed -= this.#acceleration
        }

        // max speed
        if (this.#speed > this.#maxSpeed) {
            this.#speed = this.#maxSpeed
        } else if (this.#speed < -this.#maxSpeed) {
            this.#speed = -this.#maxSpeed
        }

        // friction
        if (this.#speed > 0) {
            this.#speed -= this.#friction
        } else if (this.#speed < 0) {
            this.#speed += this.#friction
        }
        // stop at low speed
        if (Math.abs(this.#speed) < this.#friction) {
            this.#speed = 0
        }

        // turn
        if (this.#speed !== 0) {
            // flip the car when going backwards
            const flip = this.#speed > 0 ? 1 : -1

            if (this.controls.left) {
                this.angle += this.#TURN_SPEED * flip
            }
            if (this.controls.right) {
                this.angle -= this.#TURN_SPEED * flip
            }
        }

        // move
        this.x -= Math.sin(this.angle) * this.#speed
        this.y -= Math.cos(this.angle) * this.#speed
    }

    draw(ctx) {
        ctx.save()
        // translate to the point where we want the 
        // rotation to be centered at
        ctx.translate(this.x, this.y)
        ctx.rotate(-this.angle)

        ctx.beginPath()
        ctx.fillStyle = 'red'
        ctx.rect(
            - this.width / 2,
            - this.height / 2,
            this.width,
            this.height
        )
        ctx.fill()

        ctx.restore()

        this.sensor.draw(ctx)
    }
}