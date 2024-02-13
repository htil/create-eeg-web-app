//import { MuseElectronClient } from "./muse-client.js";

export const BLE = class {
  constructor(callback, connect_button_id = "bluetooth") {
    this.device = new Blue.BCIDevice(callback);

    // Connect Events
    document.getElementById(connect_button_id).onclick = function (e) {
      this.device.connect()
    }.bind(this);

  }

  get_device() {
    return this.device;
  }
};
