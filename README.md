## Description

This node app has a front-end webpage with 2 main views:

- resource view (both by client and by resource) - what projects are people working on
- chargeability view - what is the overall company chargeability

## Configuration

After pulling down the repo, copy the config.js.template  file as config.js on the server and fill in the details:

- username: the username of an admin
- password: the password for the admin
- clientId: the API client id
- clientSecret: the API client secret
- loggingVerbosity: debug, info, warn, or error
- disallowChargeability: true or false indicating whether the chargeability is disabled for all users
- chargeabilityPassword: the password used to authenticate users for the chargeability page

## Chargeability Page Access

The chargeability page is more secure than the standard resource pages. In order to access the page, you must have a cookie.

To get the cookie:

1. Navigate to http://{serverUrl}/cookiegen.html
2. Enter the admin password (that matches the admin password in the config file) and click the Save Cookie button
3. Navigate to http://{serverUrl}/chargeability.html