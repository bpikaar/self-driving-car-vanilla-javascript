import Utils from './utils.js'

export default class Sensor {

    constructor(car) {
        this.car = car
        this.rayCount = 5 // number of rays within the spread
        this.rayLength = 150
        this.raySpread = Math.PI / 4 // angle of rays in degrees

        this.rays = []
        this.readings = []
    }

    #getReading(ray, borders) {
        let touches = []

        borders.forEach(border => {
            const touch = Utils.getIntersection(
                ray[0], ray[1],
                border[0], border[1]
            )

            if (touch) {
                touches.push(touch)
            }
        })

        if (touches.length == 0) return null
        else {
            const offsets = touches.map(touch => touch.offset)
            const minOffset = Math.min(...offsets)
            return touches.find(touch => touch.offset == minOffset)
        }
    }

    update(borders) {
        this.#castRays()

        this.readings = []
        this.rays.forEach(ray => {
            this.readings.push(
                this.#getReading(ray, borders)
            )
        })
    }

    draw(ctx) {
        this.rays.forEach((ray, index) => {
            let end = ray[1] // end of ray
            if (this.readings[index]) {
                end = this.readings[index]
            }

            ctx.beginPath()
            ctx.lineWidth = 2
            ctx.strokeStyle = "yellow"

            // move to start
            ctx.moveTo(ray[0].x, ray[0].y)
            // draw line to end
            ctx.lineTo(end.x, end.y)

            ctx.stroke()

            ctx.beginPath()
            ctx.lineWidth = 2
            ctx.strokeStyle = "black"

            // move to start
            ctx.moveTo(ray[1].x, ray[1].y)
            // draw line to end
            ctx.lineTo(end.x, end.y)

            ctx.stroke()
        })
    }

    #castRays() {
        this.rays = []
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = Utils.lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1) // 0.5 if only one ray
            ) + this.car.angle

            const start = {
                x: this.car.x,
                y: this.car.y
            }
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength
            }

            this.rays.push([start, end])
        }
    }
}