let http = require('http');
// Array musti diganti cara lain
var status = "";
var statusArray = [];
var filteredStatus;

http.createServer((req, res) => {
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
    // status = payload.toString();
    status = payload;
  })


  res.write('<html>');
  res.write('<body>');

  if (status=="") {
    res.write("<h1> SolarPanel </h1>");
    console.log("Nothing to see here!");
    res.write("Nothing to see here! <br><br>");
  } else {
    const newStatus = JSON.parse(status);

    // Coba-coba
    // -----------
    // console.log(newStatus);

    // res.write("<h1> JSON TOSTRING </h1>")
    // res.write(newStatus.toString());
    // res.write("<br />");
    // res.write("<br />");

    // res.write("<h1> JSON STRINGIFY </h1>");
    // res.write(JSON.stringify(newStatus));
    // res.write("<br />");
    // res.write("<br />");

    let obj = newStatus;

    // List semua disini
    // -----------------
    // for (key in obj) {
    //   // console.log(key+':'+JSON.stringify(obj[key]));
    //   res.write(key+':'+JSON.stringify(obj[key]));
    //   res.write('<br />')
    //   res.write('<br />')
    // }

    res.write("<h1> SolarPanel </h1>");

    // Device ID
    // -----------------
    res.write('<b>Device ID: </b>');
    res.write(obj['end_device_ids'].device_id);
    res.write("<br />");

    // Received At
    // -----------------
    const rec = obj['received_at'];

    res.write('<b>Received At:  </b>');
    res.write(obj['received_at']);
    res.write("<br /><br />");

    // Buat Array
    // console.log(statusArray.push(rec.toString()));
    // res.write(statusArray.toString());

  }

  // Auto Reload every 1 Second
  res.write("<script> window.setInterval('refresh()', 5000); function refresh() {window .location.reload();} </script>")

  // // Reload Button
  // res.write('<input type="button" value="Reload Page" onClick="window.location.reload(true)">')

  // Jangan lupa filter

  res.write('</body>');
  res.write('</html>');
  res.end();
  status = []

}).listen(8080);

// Cara running, pake node solarpanel.js
