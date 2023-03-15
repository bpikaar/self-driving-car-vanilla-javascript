export default class Controls {

    forward = false
    left = false
    right = false
    reverse = false

    constructor() {
        this.addKeyboardListeners()
    }

    addKeyboardListeners() {
        document.onkeydown = (event) => {
            switch (event.key) {
                case 'w':
                case 'ArrowUp':
                    this.forward = true
                    break
                case 'a':
                case 'ArrowLeft':
                    this.left = true
                    break
                case 's':
                case 'ArrowDown':
                    this.reverse = true
                    break
                case 'd':
                case 'ArrowRight':
                    this.right = true
                    break
            }
            // console.table(this)
        }

        document.onkeyup = (event) => {
            switch (event.key) {
                case 'w':
                case 'ArrowUp':
                    this.forward = false
                    break
                case 'a':
                case 'ArrowLeft':
                    this.left = false
                    break
                case 's':
                case 'ArrowDown':
                    this.reverse = false
                    break
                case 'd':
                case 'ArrowRight':
                    this.right = false
                    break
            }
            // console.table(this)
        }
    }
}