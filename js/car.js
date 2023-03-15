import Controls from './controls.js'
import Sensor from './sensor.js'
import Utils from './utils.js'

export default class Car {

    #speed = 0
    #acceleration = 0.2
    #maxSpeed = 0
    #friction = 0.05
    #damaged = false
    angle = 0
    #TURN_SPEED = 0.02

    constructor(x, y, width, height, controlType, maxSpeed = 3) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.#maxSpeed = maxSpeed

        if(controlType !== "DUMMY") {
            this.sensor = new Sensor(this)
        }
        this.controls = new Controls(controlType)
    }

    getPolygon() {
        const radius = Math.hypot(this.width, this.height) / 2
        const alpha = Math.atan2(this.width, this.height )

        // get the 4 corners of the car
        return [
            // front left
            {
                x: this.x - Math.sin(this.angle - alpha) * radius,
                y: this.y - Math.cos(this.angle - alpha) * radius
            },
            // front right
            {
                x: this.x - Math.sin(this.angle + alpha) * radius,
                y: this.y - Math.cos(this.angle + alpha) * radius
            },
            // back right
            {
                x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
                y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius
            },
            // back left
            {
                x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
                y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius
            },
        ]
    }

    #assessDamage(borders, traffic) {
        for (const border of borders) {
            if(Utils.polyIntersect(this.getPolygon(), border)) {
                return true
            }
        }
        for (const car of traffic) {
            if(Utils.polyIntersect(this.getPolygon(), car.getPolygon())) {
                return true
            }
        }
        return false
    }

    update(borders, traffic) {
        if(!this.#damaged) {
            this.#move()
            this.#damaged = this.#assessDamage(borders, traffic)
        }
        if(this.sensor) {
            this.sensor.update(borders, traffic)
        }
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

    draw(ctx, color) {
        if(this.#damaged) {
            ctx.fillStyle = "gray"
        } else {
            ctx.fillStyle = color
        }
        ctx.beginPath()
        // color
        // draw the car
        let polygon = this.getPolygon()
        ctx.moveTo(polygon[0].x, polygon[0].y)
        for (let i = 1; i < polygon.length; i++) {
            ctx.lineTo(polygon[i].x, polygon[i].y)
        }
        ctx.fill()

        if(this.sensor) {
            this.sensor.draw(ctx)
        }
    }
}