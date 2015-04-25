var config = require('../../../config');
var logger = require('winston');
var rest = require('restler');
var OAuth = require('oauth');

var AuthController = {};

AuthController.initializeOAuth = function () {
    AuthController.oAuth2 = new OAuth.OAuth2(
        config.resourceguru.clientId,
        config.resourceguru.clientSecret,
        config.resourceguru.baseUri,
        'oauth/authorize',
        'oauth/token',
        null
    );
}

AuthController.authenticate = function (callback) {

    var url = config.resourceguru.baseUri + '/oauth/token';

    logger.debug('auth url: ' + url);

    var options = config.resourceguru.options;

    options.data = {
        "grant_type"    : "password",
        "username"      : config.resourceguru.username,
        "password"      : config.resourceguru.password,
        "client_id"     : config.resourceguru.clientId,
        "client_secret" : config.resourceguru.clientSecret
    }

    rest.post(url, options)
        .on('success', function(result, response) {
            if (!config.resourceguru.oauth) {
                config.resourceguru.oauth = {};
            }
            config.resourceguru.oauth.accessToken = result.access_token;
            config.resourceguru.oauth.refreshToken = result.refresh_token;
            config.resourceguru.oauth.setupDate = new Date();

            logger.debug("oauth access token: " + config.resourceguru.oauth.accessToken);
            callback(null);
        })
        .on('fail', function (result, response) {
            logger.error('ResourceGuru auth failed: ' + result);
            callback(result);
        })
        .on('error', function (result, response) {
            logger.error('ResourceGuru auth failed: ' + result);
            callback(result);
        });
}

AuthController.getAccessToken = function(callback) {
    var dateToday = new Date();
    if (!config.resourceguru.oauth.setupDate || config.resourceguru.oauth.setupDate + 6 < dateToday) {
        logger.info('token has expired or will expire soon, authenticate again')
        AuthController.authenticate(function (err) {
            if (err) {
                callback(err);
            }
            callback(null, config.resourceguru.oauth.accessToken);
        });
    }
    else {
        callback(null, config.resourceguru.oauth.accessToken);
    }
}

AuthController.initialize = function () {
    logger.debug('initializing resourceguru auth');
    AuthController.initializeOAuth();
    AuthController.authenticate(function (err) {
        if (err) {
            logger.error('error authenticating against resourceguru: ' + err);
        }
        else {
            logger.info('successfully authenticated against resourceguru');
        }
    });
}

// call initialize when the module is setup
AuthController.initialize();

module.exports = AuthController;

logger.debug('AuthController loaded');