export default class Controller {
  #view
  #camera
  #worker
  #blikedCounter = 0
  constructor({ view, worker, camera }) {
    this.#view = view
    this.#camera = camera
    this.#worker = this.#configureWorker(worker)
    this.#view.configureOnBtnClick(this.onBtnStart.bind(this))
  }

  static async initialize(deps) {
    const controller = new Controller(deps)
    controller.log("not yet detecting eye blink click in the button to start")
    return controller.init()
  }

  #configureWorker(worker) {
    let ready = false
    worker.onmessage = ({ data }) => {
      if ('READY' === data) {
        console.log('worker is ready')
        this.#view.enableButton()
        ready = true
        return;
      }
      const blinked = data.blinked
      this.#blikedCounter+=blinked
      this.#view.togglePlayVideo()
    }
    return {
      send(msg) {
        if (!ready) return;
        worker.postMessage(msg)
      }
    }
  }

  loop() {
    const video = this.#camera.video
    const img = this.#view.getVideoFrame(video)
    this.#worker.send(img)
    this.log("detecting eye blink...")
    setTimeout(() => this.loop(), 100)
  }

  async init() {
    console.log("Init")
  }

  log(text) {
    const times = `[times] => ${this.#blikedCounter}`
    this.#view.log(`status: ${text} `.concat(this.#blikedCounter ? times : ""))
  }

  onBtnStart() {
    this.log('initializing detection')
    this.#blikedCounter = 0
    this.loop()
  }

}