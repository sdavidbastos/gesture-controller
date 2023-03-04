export function supportsWorkerType() {
    let supports = false
    const tester = {
        get type() { supports = true }
    }
    try {
        new Worker('blob://', tester).terminate()
    } finally {
        return supports
    }
}

export async function getWorker({ service, workerPath }) {
    if (supportsWorkerType()) {
        console.log("Initializing esm workers")
        const worker = new Worker(workerPath, { type: 'module' });
        return worker
    }
    console.warn("Your browser doens't support esm modules on webworkers!")
    console.warn("Importing library...")
    await import("https://unpkg.com/@tensorflow/tfjs-core@2.4.0/dist/tf-core.js")
    await import("https://unpkg.com/@tensorflow/tfjs-converter@2.4.0/dist/tf-converter.js")
    await import("https://unpkg.com/@tensorflow/tfjs-backend-webgl@2.4.0/dist/tf-backend-webgl.js")
    await import("https://unpkg.com/@tensorflow-models/face-landmarks-detection@0.0.1/dist/face-landmarks-detection.js")
    console.warn("Using work mock instead")

    const workerMock = {
        async postMessage(video) {
            const blinked = await service.handBlinked(video)
            if (!blinked) return;
            workerMock.onmessage({ data: { blinked } })
        },
        // vai ser sobrescrito pela controller
        onmessage(msg) { }
    }
    console.log("[mock]loading tf model")
    await service.loadModel()
    console.log("[mock]tf model loaded!")
    setTimeout(() => worker.onmessage({ data: 'READY' }), 500)
    return workerMock
}