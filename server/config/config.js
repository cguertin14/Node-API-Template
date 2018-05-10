import fs from 'fs';
const env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
    let config = require('./json/config.json');
    let envConfig = config[env];
    
    Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key]);
}

process.env.URL = 'http://localhost:3000';