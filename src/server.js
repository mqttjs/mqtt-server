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
  }
};

module.exports = {
  startServers: function(options, clientHandler, callback){
    _.defaults(options, defaults);

    var servers = {};
    servers['mqtt'] = this.createServer(clientHandler);
    servers['mqtts'] = this.createSecureServer(options.ssl, clientHandler);
    servers['ws'] = this.createWebSocketServer(clientHandler);
    servers['wss'] = this.createSecureWebSocketServer(options.ssl, clientHandler);

    servers['mqtt'].listen(options.ports.mqtt, function(){
      servers['mqtts'].listen(options.ports.mqtts, function(){
        servers['ws'].listen(options.ports.ws, function(){
          servers['wss'].listen(options.ports.wss, callback);
        });
      });
    });

    return servers;
  },
  createServer: function(clientHandler) {
    return net.createServer(function(connection){
      clientHandler(mqtt(connection));
    });
  },
  createSecureServer: function(options, clientHandler){
    return tls.createServer(options, function(connection){
      clientHandler(mqtt(connection));
    });
  },
  attachServer: function(server, clientHandler) {
    (new ws.Server({
      server: server
    })).on('connection', function(ws) {
      clientHandler(mqtt(wsStream(ws)));
    });
  },
  createWebSocketServer: function(clientHandler){
    var server = http.createServer();
    this.attachServer(server, clientHandler);
    return server;
  },
  createSecureWebSocketServer: function(options, clientHandler){
    var server = https.createServer(options);
    this.attachServer(server, clientHandler);
    return server;
  }
};
