import { TensorDSP } from "./tensor-dsp.js"

export const Signal = class {
    constructor(graph_handlers, buffer_size=256) {
        this.graph_handlers = graph_handlers
        this.channels = {}
        this.BUFFER_SIZE = buffer_size
        this.tensor = new TensorDSP("muse")

        // If filtered preview is needed consider adding a filtered_channels object that holds a filtered copy of the raw data.
        // You could use the shift function on this data also to implement real-time filtered data visualization. 
        // This will come with a computational cost.
    }

    add_data(sample) {
        let { electrode, data } = sample;
        if (!this.channels[electrode]) {
            this.channels[electrode] = [];
        }

         // Add all samples to current array
        for (let i in data) {
            if (this.channels[electrode].length > this.BUFFER_SIZE - 1) {
                this.channels[electrode].shift();
            }
    
            this.channels[electrode].push(data[i]);
        }
        this.update_graph_handlers(data, electrode)
    }

    // Update all visualizers with new data
    update_graph_handlers(data, electrode) {
        for (let i in this.graph_handlers) {
            this.graph_handlers[i].add_data(data, electrode)
        }
    }

    get_data() {
        return this.channels
    }
}