'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://mkim:passw0rd!@ds139951.mlab.com:39951/caprese-app';
exports.TEST_DATABASE_URL = process.env.DATABASE_URL || 'mongodb://mkim:passw0rd!@ds139951.mlab.com:39951/caprese-app-test';
exports.PORT = process.env.PORT || 3000;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';