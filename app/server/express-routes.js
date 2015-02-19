var test = require('./routes/test');
var bookings = require('./routes/bookings');
var clients = require('./routes/clients');
var projects = require('./routes/projects');
var resources = require('./routes/resources');
var chargeability = require('./routes/chargeability');

module.exports = function (app) {
    app.use('/test', test);
    app.use('/bookings', bookings);
    app.use('/clients', clients);
    app.use('/projects', projects);
    app.use('/resources', resources);
    app.use('/chargeability', chargeability);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
};
