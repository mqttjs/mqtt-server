# mqtt-server&nbsp;&nbsp;&nbsp;[![Build Status](https://travis-ci.org/mqttjs/mqtt-server.png)](https://travis-ci.org/mqttjs/mqtt-server)

Simple API to build your own MQTT server on top of it.

## Install

```bash
npm install mqtt-server --save
```

## Examples

Launch all available servers:

```js
var fs = require('fs');
var mqtt = require('mqtt-server');

mqtt.startServers({
  ssl: {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt')
  },
  ports: {
    mqtt: 9001,
    mqtts: 9002,
    ws: 9003,
    wss: 9004
  }
}, function(client){
  // the client handler
  client.connack({
    returnCode: 0
  });
}, function(){
  console.log('listening');
});
```

## Contributing

mqtt-server is an **OPEN Open Source Project**. This means that:

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is more like an open wiki than a standard guarded open source project.

See the [CONTRIBUTING.md](https://github.com/mqttjs/mqtt-server/blob/master/CONTRIBUTING.md) file for more details.

### Contributors

mqtt-server is only possible due to the excellent work of the following contributors:

<table><tbody>
<tr><th align="left">Joël Gähwiler</th><td><a href="https://github.com/256dpi">GitHub/256dpi</a></td><td><a href="http://twitter.com/256dpi">Twitter/@256dpi</a></td></tr>
<tr><th align="left">Matteo Collina</th><td><a href="https://github.com/mcollina">GitHub/mcollina</a></td><td><a href="http://twitter.com/matteocollina">Twitter/@matteocollina</a></td></tr>
<tr><th align="left">Adam Rudd</th><td><a href="https://github.com/adamvr">GitHub/adamvr</a></td><td><a href="http://twitter.com/adam_vr">Twitter/@adam_vr</a></td></tr>
</tbody></table>

License
-------

MIT
