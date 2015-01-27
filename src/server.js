var css = require('create-stream-server');
var mqtt = require('mqtt-connection');

module.exports = function(config, options, clientHandler){
  if(!config) config = {};
  if(!options) options = {};
  if(options.emitEvents == undefined) options.emitEvents = true;

  return css(config, options, function(clientStream){
    clientHandler(mqtt(clientStream, {
      notData: !options.emitEvents
    }));
  });
};
