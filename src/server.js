var net = require('net');
var tls = require('tls');
var http = require('http');
var https = require('https');
var ws = require('ws');
var wsStream = require('websocket-stream');
var mqtt = require('mqtt-connection');
var _ = require('underscore');

var defaults = {
  ssl: {
    key: null,
    cert: null
  },
  ports: {
    mqtt: 1883,
    mqtts: 8883,
    ws: 1884,
    wss: 8884
  },
  emitEvents: true
};

var wrapClient = function(client, options) {
  return mqtt(client, {
    notData: !options.emitEvents
  })
};

module.exports = {
  startServers: function(options, clientHandler, callback){
    _.defaults(options, defaults);

    var servers = {};
    servers['mqtt'] = this.createServer(options, clientHandler);
    servers['mqtts'] = this.createSecureServer(options, clientHandler);
    servers['ws'] = this.createWebSocketServer(options, clientHandler);
    servers['wss'] = this.createSecureWebSocketServer(options, clientHandler);

    servers['mqtt'].listen(options.ports.mqtt, function(){
      servers['mqtts'].listen(options.ports.mqtts, function(){
        servers['ws'].listen(options.ports.ws, function(){
          servers['wss'].listen(options.ports.wss, callback);
        });
      });
    });

    return servers;
  },
  createServer: function(options, clientHandler) {
    return net.createServer(function(client){
      clientHandler(wrapClient(client, options));
    });
  },
  createSecureServer: function(options, clientHandler){
    return tls.createServer(options.ssl, function(client){
      clientHandler(wrapClient(client, options));
    });
  },
  attachServer: function(server, options, clientHandler) {
    (new ws.Server({
      server: server
    })).on('connection', function(ws) {
      clientHandler(wrapClient(wsStream(ws), options));
    });
  },
  createWebSocketServer: function(options, clientHandler){
    var server = http.createServer();
    this.attachServer(server, options, clientHandler);
    return server;
  },
  createSecureWebSocketServer: function(options, clientHandler){
    var server = https.createServer(options.ssl);
    this.attachServer(server, options, clientHandler);
    return server;
  }
};
