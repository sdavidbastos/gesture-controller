export default class HandGestureService {
    #gestureEstimator
    #handPoseDetection
    #handsVersion
    #gesture
    #detector = null
    constructor({
        fingerPose,
        handPoseDetection,
        handsVersion,
        gesture
    }) {
        this.#gesture = gesture
        this.#gestureEstimator = new fingerPose.GestureEstimator(gesture.knowGestures)
        this.#handPoseDetection = handPoseDetection
        this.#handsVersion = handsVersion
    }

    async estimate(keypoints3D) {
        const predictions = await this.#gestureEstimator.estimate(
            this.#getLandMarksFromKeyPoints(keypoints3D),
            9
        )
        return predictions.gestures
    }

    async* detectGestures(predictions){
        for(const hand of predictions){
            if(!hand.keypoints3D) continue;
            const gestures = await this.estimate(hand.keypoints3D);
            if(!gestures.length) continue;
            const result = gestures.reduce((previous, current) => (previous.score > current.score) ? previous.score : current.score)
            const {x, y} = hand.keypoints.find(keypoint => keypoint.name === 'index_finger_tip')
            yield {event: result.name, x, y}
            console.log("[gesture] ", this.#gesture.gestureStrings[result.name])
        }
    }

    #getLandMarksFromKeyPoints(keypoints3D) {
        return keypoints3D.map((keypoint) => [keypoint.x, keypoint.y, keypoint.z])
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
        const model = this.#handPoseDetection.SupportedModels.MediaPipeHands
        this.#detector = await this.#handPoseDetection.createDetector(model, detectorConfig)
    }
}