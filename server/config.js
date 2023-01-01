const API_VERSION = 'v1';
const IP_SERVER = 'localhost';
const PORT_DB = 27017;
const PORT_SERVER = process.env.PORT || 3070;
const PASSWORD = process.env.DATABASE_PASSWORD;

module.exports = { API_VERSION, IP_SERVER, PORT_DB, PORT_SERVER, PASSWORD }