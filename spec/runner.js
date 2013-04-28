require('jsclass')

var WebSocket = require('../lib/faye/websocket'),
    fs        = require('fs'),
    http      = require('http'),
    https     = require('https')


JS.ENV.EchoServer = function() {}
EchoServer.prototype.listen = function(port, ssl) {
  var server = ssl
             ? https.createServer({
                 key:  fs.readFileSync(__dirname + '/server.key'),
                 cert: fs.readFileSync(__dirname + '/server.crt')
               })
             : http.createServer()

  server.addListener('upgrade', function(request, socket, head) {
    var ws = new WebSocket(request, socket, head, ["echo"])
    ws.pipe(ws)
  })
  this._httpServer = server
  server.listen(port)
}
EchoServer.prototype.stop = function(callback, scope) {
  this._httpServer.addListener('close', function() {
    if (callback) callback.call(scope);
  });
  this._httpServer.close();
}


JS.require('JS.Test', function() {
  JS.Test.Unit.Assertions.define("assertBufferEqual", function(array, buffer) {
    this.assertEqual(array.length, buffer.length);
    var ary = [], n = buffer.length;
    while (n--) ary[n] = buffer[n];
    this.assertEqual(array, ary);
  })

  require('./faye/websocket/client_spec')
  JS.Test.autorun()
})

