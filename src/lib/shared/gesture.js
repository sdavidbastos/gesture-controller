import { SCROLL_DOWN, SCROLL_UP } from "./constants.js"
export class Gesture {
    #GestureDescription
    #Finger
    #FingerCurl
    gestureStrings = {
        [SCROLL_UP]: '🖐',
        [SCROLL_DOWN]: '✊️'
    }
    knowGestures = null

    constructor({ fingerPose }) {
        this.#GestureDescription = fingerPose.GestureDescription
        this.#Finger = fingerPose.Finger
        this.#FingerCurl = fingerPose.FingerCurl
        this.#init()
    }

    #init() {
        const ScrollUpGesture = new this.#GestureDescription(SCROLL_UP); // 🖐
        const ScrollDownGesture = new this.#GestureDescription(SCROLL_DOWN); // ✊️
        this.knowGestures = [ScrollUpGesture, ScrollDownGesture]

        // Rock
        // -----------------------------------------------------------------------------

        // thumb: half curled
        // accept no curl with a bit lower confidence
        ScrollDownGesture.addCurl(this.#Finger.Thumb, this.#FingerCurl.HalfCurl, 1.0);
        ScrollDownGesture.addCurl(this.#Finger.Thumb, this.#FingerCurl.NoCurl, 0.5);

        // all other fingers: curled
        for (let finger of [this.#Finger.Index, this.#Finger.Middle, this.#Finger.Ring, this.#Finger.Pinky]) {
            ScrollDownGesture.addCurl(finger, this.#FingerCurl.FullCurl, 1.0);
            ScrollDownGesture.addCurl(finger, this.#FingerCurl.HalfCurl, 0.9);
        }


        // Paper
        // -----------------------------------------------------------------------------

        // no finger should be curled
        for (let finger of this.#Finger.all) {
            ScrollUpGesture.addCurl(finger, this.#FingerCurl.NoCurl, 1.0);
        }

    }

}
