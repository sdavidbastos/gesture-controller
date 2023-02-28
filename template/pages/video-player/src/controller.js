export default class Controller {
    constructor({}){}

    async init(){
        console.log("init")
    }
  
    static async initialize(deps) {
      const controller = new Controller(deps)
      return controller.init()
    }
  }