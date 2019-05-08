// Update with your config settings.
//  esse arquivo é responsável pelas configurações de conexão c o banco de dados.
//  ele permite diferentes conxeções para diferentes ambientes (produção, desenvolvimento, testes...)
//  nesse caso ficamos apenas com as confg de produção e dispensamos as demais
const { db } = require('./.env')

module.exports = {
  // production: { 
  client: 'mysql',
  connection: db,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};