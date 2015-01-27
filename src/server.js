var css = require('create-stream-server');
var mqtt = require('mqtt-connection');

module.exports = function(options, clientHandler, callback){
  if(!options) options = {};
  if(!options.ports) options.ports = {};
  if(options.emitEvents == undefined) options.emitEvents = true;

  var servers = css({
    mqtt: {
      protocol: 'tcp',
      port: options.ports.mqtt || 1883
    }, mqtts: {
      protocol: 'ssl',
      port: options.ports.mqtts || 8883
    }, ws: {
      protocol: 'ws',
      port: options.ports.ws || 1884
    }, wss: {
      protocol: 'wss',
      port: options.ports.wss || 8884
    }
  }, {
    host: options.host || 'localhost',
    ssl: options.ssl
  }, function(clientStream){
    clientHandler(mqtt(clientStream, {
      notData: !options.emitEvents
    }));
  });

  servers.listen(callback);
};
