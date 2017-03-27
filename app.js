
var pm2       = require('pm2');
var SysLogger = require('ain2');
var logger    = new SysLogger({tag: 'pm2',  facility: 'syslog'});

function logDataToString(data) {
  let ret;
  if (data.data) {
    ret = {
      app: data.process.name,
      target_app: data.process.pm_id,
      restart_count: data.process.restart_time,
      status: data.event
    };
  } else {
    ret = {
      app: data.process.name,
      id: data.process.pm_id,
      data: data.data
    };
  }
  return JSON.stringify(ret, null, '  ');
}

pm2.launchBus(function(err, bus) {
  bus.on('*', function(event, data){
    if (event == 'process:event') {
      logger.warn(logDataToString(data));
    }
  });

  bus.on('log:err', function(data) {
    logger.warn(logDataToString(data));
  });

  bus.on('log:out', function(data) {
    logger.warn(logDataToString(data));
  });
});
