var knex = require('knex')({
  client: 'pg',
  connection: config.postgres.brown
});

module.exports = require('bookshelf')(knex);
