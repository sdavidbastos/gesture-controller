import { Camera } from "../../lib/shared/index.js"
import { getWorker } from "../../lib/shared/index.js"
import Controller from "./controller.js"
import Service from "./service.js"
import View from "./view.js"

const service = new Service({
  faceLandmarksDetection: window.faceLandmarksDetection
})
const workerPath = "../../script/video-player/worker.js"
const worker = await getWorker({ service, workerPath })
const camera = await Camera.init()
const factory = {
  async initialize() {
    return Controller.initialize({
      view: new View(),
      camera,
      worker
    })
  }
}

export default factory