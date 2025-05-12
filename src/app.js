const { BacnetClient } = require('./bacnet_client');
const { logger } = require('./common');
const { MqttClient } = require('./mqtt_client');
const config = require('config');

const mqttClient = new MqttClient();
const bacnetClient = new BacnetClient();

bacnetClient.on('values', (device, values) => {
    logger.log('info', `Sending actuals for device ${device.address} to IoT Hub`);

    mqttClient.publishMessage(values);
});
