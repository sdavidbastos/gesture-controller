export default class HandGestureService {
    #fingerPose
    #handPoseDetection
    #handsVersion
    #detector = null
    constructor({
        fingerPose,
        handPoseDetection,
        handsVersion,
    }) {
        this.#fingerPose = fingerPose
        this.#handPoseDetection = handPoseDetection
        this.#handsVersion = handsVersion
    }

    async estimateHands(video) {
        return this.#detector.estimateHands(video, {
            flipHorizontal: true
        })
    }

    async initializeDetector() {
        if (this.#detector) return this.#detector;

        const detectorConfig = {
            runtime: 'mediapipe', // or 'tfjs',
            solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${this.#handsVersion}`,
            // full é o mais pesado e o mais preciso
            modelType: 'lite',
            maxHands: 2,
        }
        const model =  this.#handPoseDetection.SupportedModels.MediaPipeHands
        this.#detector = await this.#handPoseDetection.createDetector(model, detectorConfig)
    }
}