const { BacnetClient } = require('./bacnet_client');
const { logger } = require('./common');
const { MqttClient } = require('./mqtt_client');
const config = require('config');

// init MQTT and BACnet clients
const mqttClient = new MqttClient();
const bacnetClient = new BacnetClient();

// called when device has been found
bacnetClient.on('deviceFound', (device) => {
    logger.log('info', `Device found: ${device.address}`);
    mqttClient.publishMessage(device);
});

// called when values are polled
bacnetClient.on('values', (device, values) => {
    logger.log('info', `Sending actuals for device ${device.address} to IoT Hub`);

    mqttClient.publishMessage(values);
});

// some default init logic when starting the gateway
function init() {

}
init();