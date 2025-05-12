const mqtt = require('mqtt');
const config = require('config');
const fs = require('fs');
const EventEmitter = require('events');
const {logger} = require('./common');

const gatewayId = config.get('mqtt.gatewayId');
const host = config.get('mqtt.host');
const port = config.get('mqtt.port');

class MqttClient extends EventEmitter {

    constructor() {
        super();

        var options = {
            host: host,
            port: port,
            protocol: 'mqtt'
        }

        this.client = mqtt.connect(options);
        this.client.on('connect', () => {
            this._onConnect();
        });
        this.client.on('error', (error) => {
            logger.log('error', 'Could not connect: ' + error.message);
        });
    }

    _onConnect() {
        logger.log('info', 'Client connected');

        this.client.on('message', (msg) => this._onMessage(msg));

        this.client.on('error', (error) => {
            logger.log('error', error);
        });
    };

    _onMessage(msg) {
        logger.log('info', `Received message ${msg}`);
    }

    publishMessage(messageJson) {
        const message = JSON.stringify(messageJson);
        const topic = 'devices/' + gatewayId + '/state/reported/delta';

        logger.log('info', 'Publish message to MQTT Broker');
        this.client.publish(topic, message);
    }

}

module.exports = {MqttClient};
