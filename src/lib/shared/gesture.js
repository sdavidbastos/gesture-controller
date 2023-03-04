import {SCROLL_DOWN, SCROLL_UP} from "./constants.js"
const { GestureDescription, Finger, FingerCurl } = window.fp;
  
const ScrollUpGesture = new GestureDescription(SCROLL_UP); // 🖐
const ScrollDownGesture = new GestureDescription(SCROLL_DOWN); // ✊️

  
// Rock
// -----------------------------------------------------------------------------
  
// thumb: half curled
// accept no curl with a bit lower confidence
ScrollDownGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
ScrollDownGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);

// all other fingers: curled
for(let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    ScrollDownGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
    ScrollDownGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}


// Paper
// -----------------------------------------------------------------------------
  
// no finger should be curled
for(let finger of Finger.all) {
    ScrollUpGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

const knowGestures = [
    ScrollDownGesture,
    ScrollUpGesture,
    
]

const gestureStrings = {
    [SCROLL_UP]: '🖐',
    [SCROLL_DOWN]: '✊️'
}

export {
    knowGestures,
    gestureStrings
}