var fs = require('fs');
var mqtt = require('mqtt');

var mqttServer = require('../src/server');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // trust self signed certificate

describe('server', function(){
  it('should start multiple servers and allow connection', function(done){
    mqttServer.startServers({
      ssl: {
        key: fs.readFileSync('./test/support/server.key'),
        cert: fs.readFileSync('./test/support/server.crt')
      },
      ports: {
        mqtt: 9001,
        mqtts: 9002,
        ws: 9003,
        wss: 9004
      }
    }, function(client){
      client.on('connect', function(){
        client.connack({
          returnCode: 0
        });
      });
    }, function(){
      var c1 = mqtt.connect('mqtt://0.0.0.0:9001');
      c1.on('connect', function(){
        var c2 = mqtt.connect('mqtts://0.0.0.0:9002', {
          rejectUnauthorized: false
        });
        c2.on('connect', function(){
          var c3 = mqtt.connect('ws://0.0.0.0:9003');
          c3.on('connect', function(){
            var c4 = mqtt.connect('wss://0.0.0.0:9004');
            c4.on('connect', function(){
              done();
            });
          });
        });
      });
    });
  });

  it('should start multiple servers and allow connection', function(done){
    mqttServer.startServers({
      ssl: {
        key: fs.readFileSync('./test/support/server.key'),
        cert: fs.readFileSync('./test/support/server.crt')
      },
      ports: {
        mqtt: 9005,
        mqtts: 9006,
        ws: 9007,
        wss: 9008
      },
      emitEvents: false
    }, function(client){
      client.on('connect', function(){
        assert(false);
      });
      client.on('data', function(){
        setImmediate(function(){
          client.connack({
            returnCode: 0
          });
        });
      })
    }, function(){
      var c1 = mqtt.connect('mqtt://0.0.0.0:9001');
      c1.on('connect', done)
    });
  });
});
