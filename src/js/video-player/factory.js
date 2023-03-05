import { Camera } from "../../lib/shared/index.js"
import { workerSupported, noWorkerSupported, supportsWorkerType } from "../../lib/shared/index.js"
import Controller from "./controller.js"
import Service from "./service.js"
import View from "./view.js"

let worker
const supportsWorker = supportsWorkerType()
const [rootPath] = window.location.href.split('/pages/')
const workerPath = "../../js/video-player/worker.js"
const camera = await Camera.init()
const videoUrl = `${rootPath}/assets/video.mp4`

if(supportsWorker){
  worker = workerSupported({workerPath})
}
if(!supportsWorker){
  worker = await noWorkerSupported({Service})
  setTimeout(() => worker.onmessage({ data: 'READY' }), 500);
}
const factory = {
  async initialize() {
    return Controller.initialize({
      view: new View(),
      camera,
      worker,
      videoUrl
    })
  }
}

export default factory