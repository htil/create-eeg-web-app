
import { Data } from "./data.js";
import { MuseSeries } from "./series_muse.js";

export const MuseGraph = class {
    constructor(div_id, width, height, max_data, time_interval=1) {
        this.width = document.querySelector(`#${div_id}`).parentElement.clientWidth
        //console.log("width", this.width)
        this.height = height
        this.sample_freq = 256
        this.graph = new Rickshaw.Graph({
            element: document.querySelector(`#${div_id}`), 
            width: this.width, 
            height: this.height, 
            renderer: 'line',
            series: MuseSeries(max_data, time_interval),
        });

        // 2,3,16,17 is hardcoded. BCIDevice needs to be updated to return actual channel labels based on device
        this.isChannelDataReady = {2: false, 3:false, 16: false, 17: false}
        this.recent_data_temp = {}
        this.is_active = true
        this.is_local_recording = false
        //this.data = new Data("muse", {0: "TP9", 1: "TP10", 2:"AF8", 3:"AF7"}, this.sample_freq)
        
        /*
        let updateWidth = () => {
            let w =  document.querySelector(`#${div_id}`).clientWidth
            this.graph.width = w
            console.log(w)
        }

        window.onresize = updateWidth.bind(this)
        */
        
    }

    toggle_local_recording() {
        this.is_local_recording = !this.is_local_recording
        //console.log(this.is_local_recording)
    }

    get_graph() {
        return this.graph
    }

    add_data(data, electrode) {
        //console.log("electrode", electrode)
        this.recent_data_temp[electrode] = data
        this.isChannelDataReady[electrode] = true
        this.update_graph()
    }

    reset_channel_status() {
        this.isChannelDataReady = {2: false, 3:false, 16: false, 17: false}
    }

    // Checks to see if all channels have new data
    is_refresh_ready() {
        return this.isChannelDataReady[2] && this.isChannelDataReady[3] && this.isChannelDataReady[16] && this.isChannelDataReady[17]
    }

    get_formatted_data(i) {
        return {
            TP9: this.recent_data_temp[2][i] + (this.height * .05),  //F8
            TP10: this.recent_data_temp[3][i]+ (this.height * .1),  //F7
            AF8: this.recent_data_temp[16][i] + (this.height * .2),  //TP9
            AF7: this.recent_data_temp[17][i] + (this.height * .3)   // TP10
        }
    }

    // Update graph visualizer if all channels hold new data
    update_graph() {
        //console.log("update_graph", this.is_refresh_ready(), this.is_active)
        if(this.is_refresh_ready() && this.is_active) {
            
            this.reset_channel_status()
            //console.log(this.recent_data_temp)

            // Render recent data for all channels
            //console.log(this.recent_data_temp)
            for (let i in this.recent_data_temp[2]) {
                let s = this.get_formatted_data(i)
                this.graph.series.addData(s)
                this.graph.render()
            }

            // record data session
            if(this.is_local_recording) {
                //this.data.add_data(this.recent_data_temp)
            }

            // Flush old data
            //console.log(this.recent_data_temp)
            for (let i in this.recent_data_temp) {
                //console.log("flush")
                this.recent_data_temp[i] = []
            }
        }
    }
}