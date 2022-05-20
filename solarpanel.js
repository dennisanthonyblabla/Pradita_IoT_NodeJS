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

    res.write('<h1> SolarPanel </h1>');
    res.write('Nothing to see here!');
    res.write('<br><br>');
    console.log("Nothing to see here!");

    let obj = {
      end_device_ids: {
        device_id: 'eui-70b3d57ed004e889',
        application_ids: { application_id: 'solar-panel-server' },
        dev_eui: '70B3D57ED004E889',
        join_eui: '0000000000000000'
      },
      correlation_ids: [
        'as:up:01G3G95SGQB52WXA22JNW1TRG4',
        'rpc:/ttn.lorawan.v3.AppAs/SimulateUplink:3fdb901c-65d5-43fd-8ef5-d434c6f59899'
      ],
      received_at: '2022-05-20T08:26:05.207425643Z',
      uplink_message: {
        f_port: 10,
        frm_payload: 'AaRcEA==',
        decoded_payload: { brightness: 23568, distance: 4.2 },
        rx_metadata: [ [Object] ],
        settings: { data_rate: [Object] }
      },
      simulated: true
    }

    // Device ID
    // -----------------
    res.write('<b>Device ID: </b>');
    res.write(obj['end_device_ids'].device_id);
    res.write("<br />");

    // Received At
    // -----------------

    res.write('<b>Received At:  </b>');
    res.write(obj['received_at']);
    res.write("<br />");

    // Received At
    // -----------------

    res.write('<b>Brightness: </b>');
    res.write(obj['uplink_message'].decoded_payload.brightness.toString());
    res.write("<br />");

    res.write('<b>Distance: </b>');
    res.write(obj['uplink_message'].decoded_payload.distance.toString());
    res.write("<br /><br />");


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

    res.write('<b>Received At:  </b>');
    res.write(obj['received_at']);
    res.write("<br />");

    // Received At
    // -----------------

    res.write('<b>Brightness: </b>');
    res.write(obj['uplink_message'].decoded_payload.brightness.toString());
    res.write("<br /><br />");

    const rec = obj['received_at'];

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
