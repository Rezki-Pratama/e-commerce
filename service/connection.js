var pg = require('pg');
var conString = "postgres://postgres:rafaelikram7@localhost:5432/ecommerce";

var client = new pg.Client(conString);
client.connect();
// alternative - new ES7 syntax with 'await':
// await db.one('SELECT name FROM users WHERE id = $1', [123]);

module.exports = client;