let http = require('http');
// Array musti diganti cara lain
var status = [];
var filteredStatus;

http.createServer((req, res) => {
  /*// const mqtt = require('mqtt')
  // const client = mqtt.connect('au1.cloud.thethings.network:1883')

  // client.on('connect', function() {
  //   client.subscribe('presence', function(err) {
  //     if (!err) {
  //       client.publish('presence', 'Hello mqtt')
  //     }
  //   })
  // })

  // client.on('message', function(topic, message) {
  //   status.push(message.toString());
  //   client.end();
  // })

  // console.log("Connected!");*/

const mqtt = require('mqtt')

const host = 'au1.cloud.thethings.network'
const port = '1883'
// const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
//   clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'solar-panel-server@ttn',
  password: 'NNSXS.OYFBDPD24SJQPJMCKXRNHLXOPAHF3L6ZAFAHTYI.BBMRSJYZESY2KF6REPCUHNOOHYCADKPWPUKOYSIDHVHGBDQRD24Q',
  reconnectPeriod: 1000,
})

const topic = 'v3/solar-panel-server@ttn/devices/eui-70b3d57ed004e889/up'
client.on('connect', () => {
  console.log('Connected')
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
  })
  client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
})

client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
  status.push(payload.toString());
})


  res.write('<html>');
  res.write('<body>');

  res.write('<h1>');

  // status.toString()
  filteredStatus = status.filter(name => name.includes('device_id'));
  filtered = filteredStatus.toString()
  res.write(filtered);
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