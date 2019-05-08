// função para evolução do banco de dados (controle de versões novas)
exports.up = function (knex, Promise) {
  return knex.schema.createTable('categoria', table => {
    table.increments('id').primary().notNull()
    table.string('descricao').notNull()
  })
};
// função para involução do banco de dados (controle de versões novas)
exports.down = function (knex, Promise) {
  return knex.schema.dropTable('categoria')
};
