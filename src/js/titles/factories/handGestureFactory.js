import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@4.2.0/dist/tf-core.min.js"
import "https://unpkg.com/@tensorflow/tfjs-backend-webgl@3.7.0/dist/tf-backend-webgl.min.js"
import "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.min.js"
import "https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection@2.0.0/dist/hand-pose-detection.min.js"
import "https://cdn.jsdelivr.net/npm/fingerpose@0.1.0/dist/fingerpose.min.js"

import HandGestureController from "../controllers/handGestureController.js"
import HandGestureView from "../views/handGestureView.js"
import HandGestureService from "../services/handGestureService.js"
import { Camera } from "../../../lib/shared/index.js"
import { Gesture } from "../../../lib/shared/index.js"
import { FINGER_LOCKUP_INDEXES, GESTURE_STRINGS } from "../../../lib/shared/constants.js"

const fingerPose = window.fp
const styler = new PseudoStyler()
const gesture = new Gesture({fingerPose})
const camera = await Camera.init()
gesture.init()



const factory = {
  async initialize() {
    return HandGestureController.initialize({
      camera,
      view: new HandGestureView({
        fingerLookupIndexes: FINGER_LOCKUP_INDEXES,
        styler
      }),
      service: new HandGestureService({
        handPoseDetection: window.handPoseDetection,
        handsVersion: window.VERSION,
        gestureStrings: GESTURE_STRINGS,
        fingerPose,
        gesture,
      })
    })
  }
}

export default factory