import { BLE } from "./ble.js"
import { Signal } from "./signal.js"
import { MuseGraph } from "./muse-graph.js"
import { Study } from "./study.js"

const NeuroApp = class {
    constructor() {
        console.log("NeuroApp")
        this.muse_visualizer = new MuseGraph("graph", window.innerWidth * 0.8, window.innerHeight * 0.8, 256 * 2, 1)
        this.graph_handlers = {"muse": this.muse_visualizer}
        //this.signal_handler = new Signal(this.graph_handlers, 512) // use this Object for real-time applications
        this.signal_handler = new Study(this.graph_handlers, 512)
        this.ble = new BLE(this.signal_handler.add_data.bind(this.signal_handler))
    }
}


let app = new NeuroApp()