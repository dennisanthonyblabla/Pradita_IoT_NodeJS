let http = require('http');
// Array musti diganti cara lain
var status = [];

http.createServer((req, res) => {
  const mqtt = require('mqtt')
  const client = mqtt.connect('mqtt://test.mosquitto.org')

  client.on('connect', function() {
    client.subscribe('presence', function(err) {
      if (!err) {
        client.publish('presence', 'Hello mqtt')
      }
    })
  })

  client.on('message', function(topic, message) {
    status.push(message.toString());
    client.end();
  })

  console.log("Connected!");

  res.write('<html>');
  res.write('<body>');

  res.write('<h1>');
  res.write(status.toString());
  res.write('</h1>');

  // Auto Reload every 1 Second
  // res.write("<script> window.setInterval('refresh()', 1000); function refresh() {window .location.reload();} </script>")

  // Reload Button
  res.write('<input type="button" value="Reload Page" onClick="window.location.reload(true)">')

  // Jangan lupa filter

  res.write('</body>');
  res.write('</html>');
  res.end();
  status = []

}).listen(8080);

// Cara running, pake node solarpanel.js