var net       = require('net'),
    websocket = require('../lib/websocket/driver');

var server = net.createServer(function(connection) {
  var driver = websocket.server();
  driver.addExtension(DELAY);
  driver.on('connect', function() {
    if (websocket.isWebSocket(driver)) driver.start();
    driver.messages.write("Hello from a server");
    driver.close();
  });

  driver.on('close', function() { connection.end() });
  connection.on('error', function() {});

  connection.pipe(driver.io);
  driver.io.pipe(connection);
});

var DELAY = {
  createServerSession: function (offers) {
    return new ServerSession;
  },
  name: 'permessage-delay',
  type: 'permessage',
  rsv1: false,
  rsv2: false,
  rsv3: false
};


var ServerSession = function () {
};
ServerSession.prototype.generateResponse = function () {
  return {};
};
ServerSession.prototype.processIncomingMessage = function (message, cb) {
  cb(null, message);
};
ServerSession.prototype.processOutgoingMessage = function (message, cb) {
  if (process.env.MAKE_BUG) {
    process.nextTick(function () {
      cb(null, message);
    });
  } else {
    cb(null, message);
  }
};
ServerSession.prototype.close = function () {
};


server.listen(process.argv[2]);
