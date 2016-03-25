/*
* $ npm install sandeepmistry/node-sensortag ## (require `libbluetooth-dev`)
* $ TI_UUID=your_ti_sensor_tag_UUID node this_file.js
*/
//var myUUID = process.env["TI_UUID"] || "YOUR_TI_sensor_tag_UUID";

var ids = require("./private_ids.js");
console.dir(ids)

//var myAddress = process.env["TI_ADDRESS"] || "YOUR_TI_sensor_tag_ADDRESS";
myAddress = ids[1]
 
function ti_simple_key(conned_obj) {
  conned_obj.notifySimpleKey(function() {
    console.info("ready: notifySimpleKey");
    console.info("/* left right (true = pushed, false = released) */");
    conned_obj.on("simpleKeyChange", function(left, right) { /* run per pushed button */
      console.log(left, right);
    });
  });
}
 
function ti_gyroscope(conned_obj) {
  var period = 1000; // ms
  conned_obj.enableGyroscope(function() {
    conned_obj.setGyroscopePeriod(period, function() {
      conned_obj.notifyGyroscope(function() {
        console.info("ready: notifyGyroscope");
        console.info("notify period = " + period + "ms");
        conned_obj.on('gyroscopeChange', function(x, y, z) {
          console.log('gyro_x: ' + x, 'gyro_y: ' + y, 'gyro_z: ' + z);
        });
      });
    });
  });
}
 
function ti_ir_temperature(conned_obj) {
  var period = 1000; // ms
  conned_obj.enableIrTemperature(function() {
    conned_obj.setIrTemperaturePeriod(period, function() {
      conned_obj.notifyIrTemperature(function() {
        console.info("ready: notifyIrTemperature");
        console.info("notify period = " + period + "ms");
        conned_obj.on('irTemperatureChange', function(objectTemperature, ambientTemperature) {
            console.log('\tobject temperature = %d °C', objectTemperature.toFixed(1));
            console.log('\tambient temperature = %d °C', ambientTemperature.toFixed(1));
        });
      });
    });
  });
}
 
function ti_accelerometer(conned_obj) {
  var period = 1000; // ms
  conned_obj.enableAccelerometer(function() {
    conned_obj.setAccelerometerPeriod(period, function() {
      conned_obj.notifyAccelerometer(function() {
        console.info("ready: notifyAccelerometer");
        console.info("notify period = " + period + "ms");
        conned_obj.on('accelerometerChange', function(x, y, z) {
            console.log('\taccel_x = %d G', x.toFixed(1));
            console.log('\taccel_y = %d G', y.toFixed(1));
            console.log('\taccel_z = %d G', z.toFixed(1));
        });
      });
    });
  });
}
 
function ti_humidity(conned_obj) {
  var period = 1000; // ms
  conned_obj.enableHumidity(function() {
    conned_obj.setHumidityPeriod(period, function() {
      conned_obj.notifyHumidity(function() {
        console.info("ready: notifyHumidity");
        console.info("notify period = " + period + "ms");
        conned_obj.on('humidityChange', function(temperature, humidity) {
            console.log('\ttemperature = %d °C', temperature.toFixed(1));
            console.log('\thumidity = %d %', humidity.toFixed(1));
        });
      });
    });
  });
}
 
function ti_magnetometer(conned_obj) {
  var period = 1000; // ms
  conned_obj.enableMagnetometer(function() {
    conned_obj.setMagnetometerPeriod(period, function() {
      conned_obj.notifyMagnetometer(function() {
        console.info("ready: notifyMagnetometer");
        console.info("notify period = " + period + "ms");
        conned_obj.on('magnetometerChange', function(x, y, z) {
            console.log('\tmagnet_x = %d μT', x.toFixed(1));
            console.log('\tmagnet_y = %d μT', y.toFixed(1));
            console.log('\tmagnet_z = %d μT', z.toFixed(1));
        });
      });
    });
  });
}
 
function ti_barometric_pressure(conned_obj) {
  var period = 1000; // ms
  conned_obj.enableBarometricPressure(function() {
    conned_obj.setBarometricPressurePeriod(period, function() {
      conned_obj.notifyBarometricPressure(function() {
        console.info("ready: notifyBarometricPressure");
        console.info("notify period = " + period + "ms");
        conned_obj.on('barometricPressureChange', function(pressure) {
            console.log('\tpressure = %d mBar', pressure.toFixed(1));
        });
      });
    });
  });
}
 
function ti_luxometer(conned_obj) {
  var period = 1000; // ms
  conned_obj.enableLuxometer(function() {
    conned_obj.setLuxometerPeriod(period, function() {
      conned_obj.notifyLuxometer(function() {
        console.info("ready: notifyLuxometer");
        console.info("notify period = " + period + "ms");
        conned_obj.on('luxometerChange', function(lux) {
          console.log('\tlux = %d', lux.toFixed(1));
        });
      });
    });
  });
}
 
var SensorTag = require('sensortag');
console.info(">> STOP: Ctrl+C or SensorTag power off");
console.info("start");
console.info("waiting for connect from " + myAddress);
//SensorTag.discoverByUuid(myUUID, function(sensorTag) {
SensorTag.discoverByAddress(myAddress, function(sensorTag) {
  console.info("found: connect and setup ... (waiting 5~10 seconds)");
  sensorTag.connectAndSetup(function() {
    sensorTag.readDeviceName(function(error, deviceName) {
      console.info("connect: " + deviceName);
      ti_simple_key(sensorTag);
      ti_gyroscope(sensorTag);
      ti_ir_temperature(sensorTag);
      ti_accelerometer(sensorTag);
      ti_humidity(sensorTag);
      ti_magnetometer(sensorTag);
      ti_barometric_pressure(sensorTag);
      ti_luxometer(sensorTag);
 
    });
  });
  /* In case of SensorTag PowerOff or out of range when fired `onDisconnect` */
  sensorTag.on("disconnect", function() {
    console.info("disconnect and exit");
    process.exit(0);
  });
});
