// função para evolução do banco de dados (controle de versões novas)
exports.up = function (knex, Promise) {
  return knex.schema.createTable('produto', table => {
    table.increments('id').primary().notNull()
    table.string('descricao').notNull()
    table.string('preco').notNull()
    table.integer('categoriaId').unsigned().notNullable().references('id').inTable('categoria')
  })
};
// função para involução do banco de dados (controle de versões novas)
exports.down = function (knex, Promise) {
  return knex.schema.dropTable('produto')
};
