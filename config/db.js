const config = require('../knexfile')
// instancia o arquivo de configuração 

const knex = require('knex')(config)
// instancia o knex passando o arquivo de config instanciado anteriormente

module.exports = knex 