#!/bin/env node

var express = require('express')
    , http = require('http')
    , env = process.env.NODE_ENV || 'development' // Load environment based configuration
    , config = require('./config')
    , logger = require('winston');

var app = express();

app.config = config;

logger.level = config.loggingVerbosity;

app.set('port', process.env.PORT || 3000);

// handle for openshift
if (process.env.OPENSHIFT_NODEJS_IP) {
    var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
    var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
    var server = app.listen(port, ipaddress, function() {
        logger.info('Express server listening on port ' + server.address().port);
    });
}
else {
    var server = app.listen(app.get('port'), function() {
        logger.info('Express server listening on port ' + server.address().port);
    });
}

require('./app/express-settings')(app);
require('./app/server/express-routes')(app);

module.exports = app;